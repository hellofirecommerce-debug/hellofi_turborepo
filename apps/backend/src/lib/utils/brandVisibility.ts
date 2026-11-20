type Owner =
  { stepId: string } | { optionId: string } | { conditionId: string };

type Item = { brandId?: string | null; brandName?: string | null };

/**
 * Keeps brand_visibilities rows in sync for ONE owner (step / option / condition).
 * - items undefined + strategy not sent  -> nothing changes
 * - items undefined + strategy sent      -> ALL clears rows, else updates their strategy
 * - items sent                           -> rows are replaced (ALL = none stored)
 */
export async function syncBrandVisibility(
  tx: any,
  owner: Owner,
  strategy: string,
  items: Item[] | undefined,
  strategyProvided: boolean,
) {
  if (items === undefined && !strategyProvided) return;

  if (items === undefined) {
    if (strategy === "ALL") {
      await tx.brandVisibility.deleteMany({ where: owner });
    } else {
      await tx.brandVisibility.updateMany({
        where: owner,
        data: { strategy },
      });
    }
    return;
  }

  await tx.brandVisibility.deleteMany({ where: owner });

  if (strategy !== "ALL" && items.length > 0) {
    await tx.brandVisibility.createMany({
      data: items.map((i) => ({
        ...owner,
        strategy,
        brandId: i.brandId ?? null,
        brandName: i.brandName ?? null,
      })),
    });
  }
}
