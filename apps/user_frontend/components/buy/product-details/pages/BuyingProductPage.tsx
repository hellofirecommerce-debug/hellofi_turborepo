import { notFound } from "next/navigation";
import { getBuyingProductBySlug } from "../../../../lib/data/buyingProduct.data";

export async function BuyingProductPage({
  productSlug,
}: {
  productSlug: string;
}) {
  const product = await getBuyingProductBySlug(productSlug);
  if (!product) notFound();

  const variants: any[] = product.variants ?? [];
  const specs: any[] = product.specifications ?? [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-gray-900">{product.name}</h1>
      <p className="text-sm text-gray-500 mt-1">
        {product.brand?.name} · {product.category?.name}
      </p>

      {/* Variants */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {variants.map((v) => (
          <div key={v.id} className="border rounded-lg p-4">
            <p className="font-medium text-gray-800">
              {[v.ram, v.storage, v.color].filter(Boolean).join(" / ")}
            </p>
            <p className="text-lg font-semibold mt-1">
              ₹{Number(v.price).toLocaleString("en-IN")}
            </p>
          </div>
        ))}
      </div>

      {/* Specifications */}
      {specs.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-3">Specifications</h2>
          <div className="border rounded-lg divide-y">
            {specs.map((s) => (
              <div
                key={s.id ?? s.key}
                className="flex justify-between p-3 text-sm"
              >
                <span className="text-gray-500">{s.key}</span>
                <span className="text-gray-800">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
