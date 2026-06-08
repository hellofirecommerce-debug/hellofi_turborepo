const STATS = [
  { value: "20K+", label: "Devices Sold", from: "#f472b6", via: "#ec4899" },
  {
    value: "G 4.9★",
    label: "Customer Rating",
    from: "#4ade80",
    via: "#22c55e",
  },
  {
    value: "Same Day Free",
    label: "Doorstep Pickup",
    from: "#E9D4FF",
    via: "#a78bfa",
  },
  {
    value: "Warranty Assured",
    label: "Brand & HelloFi",
    from: "#fde047",
    via: "#eab308",
  },
];

export function StatsBar() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="relative inline-flex overflow-hidden rounded-2xl p-[3px]"
          >
            <span
              className="absolute inset-[-1000%] animate-spin"
              style={{
                background: `conic-gradient(from 90deg at 50% 50%, ${stat.from} 0%, ${stat.via} 50%, ${stat.from} 100%)`,
              }}
            />
            <div
              className="relative z-10 w-full rounded-[14px] px-5 py-5 flex flex-col items-center justify-center text-center min-h-[110px] backdrop-blur-3xl"
              style={{
                background: "linear-gradient(135deg, #0F182B, #1B2638)",
              }}
            >
              <p className="text-white font-bold text-xl sm:text-2xl leading-tight">
                {stat.value}
              </p>
              <p className="text-gray-400 text-sm mt-1.5">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
