import prisma from "@repo/db";
import UserPricingService, { SelectedAnswer } from "./user.pricing.service";

// Columns we try, in order, to find the display text of a condition / option.
// If your Studio columns use a different name, add it here.
const LABEL_KEYS = ["label", "name", "title", "question", "text", "value"];

function labelOf(row: unknown): string | null {
  const r = row as Record<string, unknown>;
  for (const key of LABEL_KEYS) {
    const v = r[key];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return null;
}

type StoredAnswer = {
  stepId?: string;
  conditionId?: string;
  optionId?: string;
};

class UserSellingOrderService {
  private generateOrderNo(): string {
    return `HF${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  }

  async createSellingOrder(input: {
    userId: string;
    productId: string;
    variantId?: string | null;
    answers: SelectedAnswer[];
  }) {
    const { userId, productId, variantId, answers } = input;

    // 1. Calculate price securely on backend
    const quote = await UserPricingService.evaluateQuote({
      productId,
      variantId,
      answers,
    });

    // 2. Get product snapshot details
    const product = await prisma.sellingProduct.findUniqueOrThrow({
      where: { id: productId },
      include: { brand: true, category: true },
    });

    let variantName = null;
    if (variantId) {
      const v = await prisma.sellingVariant.findUnique({
        where: { id: variantId },
      });
      if (v) variantName = `${v.ram ?? ""} / ${v.storage}`.trim();
    }

    // 3. Save to Database
    const order = await prisma.sellingOrder.create({
      data: {
        orderNo: this.generateOrderNo(),
        userId: userId,
        sellingProductId: productId,
        variantId: variantId ?? null,
        categoryId: product.categoryId,
        brandId: product.brandId,

        productName: product.productName,
        productImage: product.image,
        brandName: product.brand.name,
        categoryName: product.category.name,
        variantName,

        basePrice: quote.basePrice,
        quotedPriceBySystem: quote.finalQuote,
        pickupCharges: 0,
        processingFee: 0,
        totalAmount: quote.finalQuote,

        selectedAnswers: answers as any,
        orderStatus: "AWAITING_ADDRESS",
        currentStep: 1,
      },
    });

    return {
      orderId: order.id,
      orderNo: order.orderNo,
      orderLink: `/sell/quote/details?orderId=${order.orderNo}`,
      quote,
      status: order.orderStatus,
    };
  }

  async getOrderByNo(orderNo: string, userId: string) {
    const order = await prisma.sellingOrder.findFirst({
      where: {
        orderNo,
        userId,
      },
      include: {
        sellingProduct: true,
        variant: true,
        brand: true,
        category: true,
      },
    });

    if (!order) return null;

    return {
      ...order,
      answers: await this.buildAnswers(order.selectedAnswers),
      createdAt: order.createdAt.toISOString(),
    };
  }

  // [{stepId, conditionId, optionId}] → [{conditionId, question, answer}]
  private async buildAnswers(raw: unknown) {
    const stored: StoredAnswer[] = Array.isArray(raw)
      ? (raw as StoredAnswer[])
      : [];
    if (stored.length === 0) return [];

    const conditionIds = [
      ...new Set(
        stored.map((a) => a.conditionId).filter((x): x is string => !!x),
      ),
    ];
    const optionIds = [
      ...new Set(stored.map((a) => a.optionId).filter((x): x is string => !!x)),
    ];

    const [conditions, options] = await Promise.all([
      prisma.sellingCondition.findMany({
        where: { id: { in: conditionIds } },
      }),
      prisma.sellingOption.findMany({
        where: { id: { in: optionIds } },
      }),
    ]);

    const conditionLabel = new Map(
      conditions.map((c) => [c.id, labelOf(c)] as const),
    );
    const optionLabel = new Map(
      options.map((o) => [o.id, labelOf(o)] as const),
    );

    // one row per condition; multi-select answers are joined with ", "
    const grouped = new Map<string, string[]>();
    for (const a of stored) {
      if (!a.conditionId) continue;
      const list = grouped.get(a.conditionId) ?? [];
      const label = a.optionId ? optionLabel.get(a.optionId) : null;
      if (label && !list.includes(label)) list.push(label);
      grouped.set(a.conditionId, list);
    }

    return [...grouped.entries()].map(([conditionId, labels]) => ({
      conditionId,
      question: conditionLabel.get(conditionId) ?? "Condition",
      answer: labels.length > 0 ? labels.join(", ") : "—",
    }));
  }
}

export default new UserSellingOrderService();
