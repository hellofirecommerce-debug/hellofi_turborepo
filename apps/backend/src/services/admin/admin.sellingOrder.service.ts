import { GraphQLError } from "graphql";
import { OrderStatus, Prisma } from "@prisma/client";
import prisma from "@repo/db";

const err = (message: string, code = "BAD_REQUEST") =>
  new GraphQLError(message, { extensions: { code } });

const IST_MS = 5.5 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

export interface AdminOrderFilter {
  page?: number | null;
  limit?: number | null;
  dateFilter?:
    | "ALL_TIME"
    | "THIS_MONTH"
    | "LAST_MONTH"
    | "LAST_3_MONTHS"
    | "YEAR"
    | "MONTH_YEAR"
    | "DAY"
    | "CUSTOM"
    | null;
  startDate?: string | null; // YYYY-MM-DD (DAY / CUSTOM)
  endDate?: string | null; // YYYY-MM-DD (CUSTOM)
  year?: number | null;
  month?: number | null; // 1-12
  productName?: string | null;
  customerName?: string | null;
  customerNumber?: string | null;
  orderNo?: string | null;
  city?: string | null;
  orderStatus?: string | null; // OrderStatus enum (Order Progress)
  timelineStatus?: string | null; // latest timeline status (Order Status column)
  fulfilment?: "ALL" | "PENDING" | "FULFILLED" | null;
}

// ---------- IST date helpers (all ranges are [gte, lt) ) ----------
const istNow = () => new Date(Date.now() + IST_MS);

const monthRange = (year: number, month0: number) => ({
  gte: new Date(Date.UTC(year, month0, 1) - IST_MS),
  lt: new Date(Date.UTC(year, month0 + 1, 1) - IST_MS),
});

const dayStart = (iso: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) throw err("Invalid date");
  return new Date(`${iso}T00:00:00Z`).getTime() - IST_MS;
};

function resolveRange(f: AdminOrderFilter) {
  const now = istNow();
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth();

  switch (f.dateFilter) {
    case "THIS_MONTH":
      return monthRange(y, m);

    case "LAST_MONTH":
      return monthRange(y, m - 1);

    case "LAST_3_MONTHS": // this month + the 2 months before it
      return { gte: monthRange(y, m - 2).gte, lt: monthRange(y, m).lt };

    case "YEAR": {
      if (!f.year) throw err("Please choose a year");
      return {
        gte: new Date(Date.UTC(f.year, 0, 1) - IST_MS),
        lt: new Date(Date.UTC(f.year + 1, 0, 1) - IST_MS),
      };
    }

    case "MONTH_YEAR": {
      if (!f.year || !f.month) throw err("Please choose a month and year");
      if (f.month < 1 || f.month > 12) throw err("Invalid month");
      return monthRange(f.year, f.month - 1);
    }

    case "DAY": {
      if (!f.startDate) throw err("Please choose a date");
      const start = dayStart(f.startDate);
      return { gte: new Date(start), lt: new Date(start + DAY_MS) };
    }

    case "CUSTOM": {
      if (!f.startDate || !f.endDate) {
        throw err("Please choose both a start date and an end date");
      }
      const start = dayStart(f.startDate);
      const end = dayStart(f.endDate);
      if (end < start) throw err("End date cannot be before start date");
      return { gte: new Date(start), lt: new Date(end + DAY_MS) }; // end date included
    }

    default: // ALL_TIME or nothing selected
      return undefined;
  }
}

const clean = (v?: string | null) => v?.trim() || undefined;

// ids of orders whose LATEST timeline event has this status
async function orderIdsAtStatus(status: string) {
  const rows = await prisma.$queryRaw<{ orderId: string }[]>`
    SELECT t."orderId"
    FROM (
      SELECT DISTINCT ON ("orderId") "orderId", status
      FROM order_timeline
      ORDER BY "orderId", "createdAt" DESC
    ) t
    WHERE t.status = ${status}`;
  return rows.map((r) => r.orderId);
}

// every string inside a JSON value (keys + values), whatever its shape
function collectStrings(v: unknown, out: Set<string>) {
  if (typeof v === "string") out.add(v);
  else if (Array.isArray(v)) v.forEach((x) => collectStrings(x, out));
  else if (v && typeof v === "object") {
    for (const [k, x] of Object.entries(v)) {
      out.add(k);
      collectStrings(x, out);
    }
  }
}

async function buildWhere(
  f: AdminOrderFilter,
): Promise<Prisma.SellingOrderWhereInput> {
  const and: Prisma.SellingOrderWhereInput[] = [];

  const range = resolveRange(f);
  if (range) and.push({ createdAt: range });

  const orderNo = clean(f.orderNo);
  if (orderNo)
    and.push({ orderNo: { contains: orderNo, mode: "insensitive" } });

  const productName = clean(f.productName);
  if (productName) {
    and.push({ productName: { contains: productName, mode: "insensitive" } });
  }

  const customerName = clean(f.customerName);
  if (customerName) {
    // every word must match first or last name ("Stefiya Shiji" works)
    const tokens = customerName.split(/\s+/).filter(Boolean);
    and.push({
      OR: [
        {
          user: {
            AND: tokens.map((t) => ({
              OR: [
                { fName: { contains: t, mode: "insensitive" as const } },
                { lName: { contains: t, mode: "insensitive" as const } },
              ],
            })),
          },
        },
        { address: { path: ["name"], string_contains: customerName } },
      ],
    });
  }

  const customerNumber = clean(f.customerNumber);
  if (customerNumber) {
    and.push({
      OR: [
        { user: { contact: { contains: customerNumber } } },
        { address: { path: ["contact"], string_contains: customerNumber } },
      ],
    });
  }

  const city = clean(f.city);
  if (city) {
    and.push({
      OR: [
        { address: { path: ["cityDistrict"], string_contains: city } },
        { contactCity: { equals: city, mode: "insensitive" } },
      ],
    });
  }

  const orderStatus = clean(f.orderStatus);
  if (orderStatus) {
    if (!(Object.values(OrderStatus) as string[]).includes(orderStatus)) {
      throw err("Invalid order status");
    }
    and.push({ orderStatus: orderStatus as OrderStatus });
  }

  const timelineStatus = clean(f.timelineStatus);
  if (timelineStatus) {
    and.push({ id: { in: await orderIdsAtStatus(timelineStatus) } });
  }

  if (f.fulfilment === "PENDING") and.push({ isFullFilled: false });
  if (f.fulfilment === "FULFILLED") and.push({ isFullFilled: true });

  return and.length ? { AND: and } : {};
}

class AdminSellingOrderService {
  // ---------- LIST: 10 per page + all filters + device report ----------
  async list(filter: AdminOrderFilter = {}) {
    const limit = Math.min(
      Math.max(filter.limit ?? DEFAULT_LIMIT, 1),
      MAX_LIMIT,
    );
    const page = Math.max(filter.page ?? 1, 1);
    const where = await buildWhere(filter);

    const [total, rows] = await Promise.all([
      prisma.sellingOrder.count({ where }),
      prisma.sellingOrder.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          orderNo: true,
          productName: true,
          productImage: true,
          brandName: true,
          categoryName: true,
          variantName: true,
          listedPrice: true,
          quotedPriceBySystem: true,
          quotedPrice: true,
          pickupCharges: true,
          processingFee: true,
          totalAmount: true,
          orderStatus: true,
          pickupMethod: true,
          isDropToOffice: true,
          isFullFilled: true,
          followupStatus: true,
          followupCount: true,
          serialOrIMEI: true,
          additionalNotes: true,
          invoiceLink: true,
          address: true,
          selectedAnswers: true,
          orderTimelineName: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              fName: true,
              lName: true,
              contact: true,
              pincode: true,
            },
          },
          // latest timeline event = current status
          timelineEvents: {
            orderBy: { createdAt: "desc" },
            take: 1,
            select: { status: true, label: true, createdAt: true },
          },
        },
      }),
    ]);

    // device report: one query for all orders on this page
    const answerIds = new Set<string>();
    rows.forEach((r) => collectStrings(r.selectedAnswers, answerIds));
    const ids = [...answerIds].filter((s) => s.length > 0 && s.length <= 64);

    const options = ids.length
      ? await prisma.sellingOption.findMany({
          where: { id: { in: ids } },
          select: {
            id: true,
            label: true,
            condition: {
              select: {
                id: true,
                title: true,
                finalConditionName: true,
                priority: true,
                step: {
                  select: {
                    id: true,
                    stepNumber: true,
                    stepName: true,
                    title: true,
                    finalStepTitle: true,
                  },
                },
              },
            },
          },
        })
      : [];
    const optionById = new Map(options.map((o) => [o.id, o]));

    return {
      total,
      page,
      limit,
      totalPages: Math.max(Math.ceil(total / limit), 1),
      orders: rows.map(
        ({ timelineEvents, createdAt, user, selectedAnswers, ...o }) => {
          const last = timelineEvents[0];

          // group this order's selected options: step -> condition -> answers
          const picked = new Set<string>();
          collectStrings(selectedAnswers, picked);

          const steps = new Map<
            string,
            {
              number: number;
              title: string;
              items: Map<
                string,
                { priority: number; question: string; answers: string[] }
              >;
            }
          >();

          for (const id of picked) {
            const opt = optionById.get(id);
            if (!opt) continue;
            const c = opt.condition;
            const s = c.step;

            let sec = steps.get(s.id);
            if (!sec) {
              sec = {
                number: s.stepNumber,
                title: s.finalStepTitle || s.title || s.stepName,
                items: new Map(),
              };
              steps.set(s.id, sec);
            }
            let item = sec.items.get(c.id);
            if (!item) {
              item = {
                priority: c.priority,
                question: c.finalConditionName || c.title,
                answers: [],
              };
              sec.items.set(c.id, item);
            }
            item.answers.push(opt.label);
          }

          return {
            ...o,
            createdAt: createdAt.toISOString(),
            // keep the GraphQL shape: { id, name, phone, pincode }
            user: {
              id: user.id,
              name: `${user.fName} ${user.lName}`.trim(),
              phone: user.contact,
              pincode: user.pincode,
            },
            timelineName: o.orderTimelineName,
            timelineStatus: last?.status ?? null,
            timelineLabel: last?.label ?? null,
            timelineUpdatedAt: last?.createdAt.toISOString() ?? null,
            deviceReport: [...steps]
              .sort((a, b) => a[1].number - b[1].number)
              .map(([stepId, s]) => ({
                stepId,
                title: s.title,
                items: [...s.items]
                  .sort((a, b) => a[1].priority - b[1].priority)
                  .map(([conditionId, c]) => ({
                    conditionId,
                    question: c.question,
                    answer: c.answers.join(", "),
                  })),
              })),
          };
        },
      ),
    };
  }

  // ---------- cities for the filter dropdown ----------
  async cities() {
    const rows = await prisma.serviceablePincode.findMany({
      where: { isActive: true },
      select: { city: true },
      distinct: ["city"],
      orderBy: { city: "asc" },
    });
    return rows.map((r) => r.city);
  }

  // ---------- full timeline of ONE order (for the status dropdown) ----------
  async timelineState(orderNo: string) {
    const order = await prisma.sellingOrder.findUnique({
      where: { orderNo },
      select: {
        orderNo: true,
        timeline: {
          select: {
            name: true,
            steps: {
              orderBy: { position: "asc" },
              select: { status: true, label: true, position: true },
            },
          },
        },
        timelineEvents: {
          orderBy: { createdAt: "asc" },
          select: { status: true, label: true, message: true, createdAt: true },
        },
      },
    });
    if (!order) throw err("Order not found", "NOT_FOUND");

    const steps = order.timeline?.steps ?? [];
    const current =
      order.timelineEvents[order.timelineEvents.length - 1]?.status ?? null;
    const currentIdx = current
      ? steps.findIndex((s) => s.status === current)
      : -1;

    return {
      orderNo: order.orderNo,
      timelineName: order.timeline?.name ?? null,
      currentStatus: current,
      steps: steps.map((s, i) => ({
        status: s.status,
        label: s.label,
        position: s.position,
        state:
          i < currentIdx
            ? "DONE"
            : i === currentIdx
              ? "CURRENT"
              : i === currentIdx + 1
                ? "NEXT"
                : "LOCKED",
      })),
      events: order.timelineEvents.map((e) => ({
        status: e.status,
        label: e.label,
        message: e.message,
        createdAt: e.createdAt.toISOString(),
      })),
    };
  }

  // ---------- UPDATE STATUS: only to the very next step of the timeline ----------
  async updateTimelineStatus(
    orderNo: string,
    status: string,
    message?: string | null,
  ) {
    const target = status.trim();
    if (!target) throw err("Please select a status");

    const order = await prisma.sellingOrder.findUnique({
      where: { orderNo },
      select: {
        id: true,
        orderTimelineName: true,
        timelineEvents: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { id: true, status: true },
        },
      },
    });
    if (!order) throw err("Order not found", "NOT_FOUND");
    if (!order.orderTimelineName) throw err("This order has no timeline yet");

    // 1. fetch the timeline completely
    const timeline = await prisma.timeline.findUnique({
      where: { name: order.orderTimelineName },
      include: { steps: { orderBy: { position: "asc" } } },
    });
    if (!timeline || timeline.steps.length === 0) {
      throw err(`Timeline "${order.orderTimelineName}" is not configured`);
    }
    const steps = timeline.steps;

    // 2. current status = latest timeline event
    const lastEvent = order.timelineEvents[0];
    const current = lastEvent?.status ?? null;
    const currentIdx = current
      ? steps.findIndex((s) => s.status === current)
      : -1;
    if (current && currentIdx === -1) {
      throw err("Current status is not part of this order's timeline");
    }

    // 3. is the requested status valid?
    const targetIdx = steps.findIndex((s) => s.status === target);
    const targetStep = steps[targetIdx];
    if (!targetStep)
      throw err("This status is not part of the order's timeline");

    if (targetIdx === currentIdx) throw err("Order is already at this status");
    if (targetIdx < currentIdx)
      throw err("You cannot move an order back to an earlier status");

    const nextStep = steps[currentIdx + 1];
    if (!nextStep) throw err("This order's timeline is already completed");

    // 4. no jumping: the target must be exactly the next step
    if (targetStep.status !== nextStep.status) {
      throw err(
        `You cannot jump to "${targetStep.label}". The next status is "${nextStep.label}".`,
      );
    }

    const isLast = currentIdx + 1 === steps.length - 1;

    // 5. one transaction: lock the order, re-check latest event, add the new one
    await prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT id FROM selling_orders WHERE id = ${order.id} FOR UPDATE`;

      const latest = await tx.orderTimeline.findFirst({
        where: { orderId: order.id },
        orderBy: { createdAt: "desc" },
        select: { id: true },
      });
      if ((latest?.id ?? null) !== (lastEvent?.id ?? null)) {
        throw err(
          "This order was just updated by someone else. Please refresh.",
        );
      }

      await tx.orderTimeline.create({
        data: {
          orderId: order.id,
          status: nextStep.status,
          label: nextStep.label,
          message: message?.trim() || nextStep.label,
        },
      });

      if (isLast) {
        await tx.sellingOrder.update({
          where: { id: order.id },
          data: { isFullFilled: true },
        });
      }
    });

    return this.timelineState(orderNo);
  }
}

export default new AdminSellingOrderService();
