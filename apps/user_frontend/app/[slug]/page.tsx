import { notFound } from "next/navigation";

// BUY categories: slug after "buy-used-"
const BUY_MAP: Record<string, { title: string; category: string | null }> = {
  gadgets: { title: "Buy Used Gadgets", category: "all" }, // all
  "mobile-phones": {
    title: "Buy Used Mobile Phones",
    category: "mobile-phones",
  },
  laptops: { title: "Buy Used Laptops", category: "laptops" },
  tablets: { title: "Buy Used Tablets", category: "tablets" },
  smartwatches: { title: "Buy Used Smartwatches", category: "smartwatches" },
  accessories: { title: "Buy Used Accessories", category: "accessories" },
};

// SELL categories: slug after "sell-old-" / "sell-other-"
const SELL_MAP: Record<string, { title: string; category: string }> = {
  "mobile-phone": { title: "Sell Old Mobile Phone", category: "mobile-phone" },
  laptop: { title: "Sell Old Laptop", category: "laptop" },
  tablet: { title: "Sell Old Tablet", category: "tablet" },
  "smart-watch": { title: "Sell Old Smart Watch", category: "smart-watch" },
  accessories: { title: "Sell Other Accessories", category: "accessories" },
};

export default async function DynamicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // ---------- BUY ----------
  if (slug.startsWith("buy-used-")) {
    const key = slug.replace("buy-used-", "");
    const info = BUY_MAP[key];
    if (!info) notFound();

    // TODO: your BUY api call here using info.category (null = all)
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 min-h-dvh">
        <h1 className="text-2xl font-bold">{info.title}</h1>
        <p className="mt-4 text-lg">
          Mode: <strong>BUY</strong> | Category: <strong>{key}</strong>
        </p>
      </div>
    );
  }

  // ---------- SELL ----------
  if (slug.startsWith("sell-old-") || slug.startsWith("sell-other-")) {
    const key = slug.replace("sell-old-", "").replace("sell-other-", "");
    const info = SELL_MAP[key];
    if (!info) notFound();

    // TODO: your SELL api call here using info.category
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 min-h-dvh">
        <h1 className="text-2xl font-bold">{info.title}</h1>
        <p className="mt-4 text-lg">
          Mode: <strong>SELL</strong> | Category: <strong>{key}</strong>
        </p>
      </div>
    );
  }

  // anything else -> not found
  notFound();
}
