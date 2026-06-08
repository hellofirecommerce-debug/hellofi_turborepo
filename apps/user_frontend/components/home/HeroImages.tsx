import Image from "next/image";

export function HeroImages() {
  return (
    <>
      {/* Desktop: tall phone + 2 stacked */}
      <div className="hidden lg:flex items-start gap-3 flex-shrink-0">
        {/* Main tall phone */}
        <div className="rounded-2xl overflow-hidden w-[280px] h-[390px]">
          <Image
            src="/images/home/hero-phone.jpg"
            alt="Featured phone"
            width={280}
            height={390}
            className="object-cover w-full h-full"
            priority
          />
        </div>

        {/* Right stacked */}
        <div className="flex flex-col gap-3">
          <div className="rounded-2xl overflow-hidden w-[280px] h-[200px]">
            <Image
              src="/images/home/hero-technician.png"
              alt="Technician"
              width={280}
              height={200}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="rounded-2xl overflow-hidden w-[280px] h-[180px]">
            <Image
              src="/images/home/hero-snapmint.jpg"
              alt="Snapmint EMI"
              width={280}
              height={180}
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </div>

      {/* Mobile: 2 side-by-side */}
      <div className="flex lg:hidden gap-3">
        <div className="flex-1 rounded-2xl overflow-hidden">
          <Image
            src="/images/home/hero-mobile-1.jpg"
            alt="Unboxing"
            width={600}
            height={400}
            className="object-cover w-full h-[160px]"
          />
        </div>
        <div className="flex-1 rounded-2xl overflow-hidden">
          <Image
            src="/images/home/hero-mobile-2.jpg"
            alt="Smartwatch"
            width={600}
            height={400}
            className="object-cover w-full h-[160px]"
          />
        </div>
      </div>
    </>
  );
}
