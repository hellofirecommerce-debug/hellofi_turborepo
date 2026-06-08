import { Banknote, CircleCheck, ShieldCheck, Tag, Truck } from "lucide-react";

export function SEOContentSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-gray-100">
      {/* Hero text */}
      <h1 className="text-xl sm:text-2xl font-bold text-[#1a1a2e] mb-3 leading-snug">
        Sell Used Mobile Phones, Laptops, Apple MacBooks, Tablets, Smartwatches
        and Buy Secondhand Mobile Phones, Laptops, Apple MacBooks, Tablets,
        Smartwatches with HelloFi.
      </h1>
      <p className="text-sm text-gray-500 leading-relaxed mb-2">
        HelloFi makes it simple to sell your old gadgets online and get great
        resale value. From phones and laptops to tablets and smartwatches, you
        can sell your devices quickly with a free doorstep pickup.
      </p>
      <p className="text-sm text-gray-500 leading-relaxed mb-10">
        HelloFi also offers certified preowned phones, laptops, macbooks,
        tablets, smartwatches that are carefully tested for quality and
        performance before reaching customers.
      </p>

      {/* Why HelloFi */}
      <h2 className="text-base font-bold text-[#1a1a2e] mb-4">
        Why is HelloFi considered one of the best platforms to sell old phones
        and buy old smartphones in India?
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          {
            icon: <Tag />,
            title: "Best Market Price",
            desc: "We offer the most competitive resale prices.",
          },
          {
            icon: <Truck />,
            title: "Free Doorstep Pickup",
            desc: "We come to your door — no travel required.",
          },
          {
            icon: <Banknote />,
            title: "Instant Payment",
            desc: "Get paid via UPI or bank transfer instantly.",
          },
          {
            icon: <ShieldCheck />,
            title: "100% Safe & Secure",
            desc: "Your data is wiped before processing.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="bg-card-surface border border-card-border rounded-xl p-4"
          >
            <div className="text-2xl mb-2 text-primary">{item.icon}</div>
            <p className="text-xs font-bold text-black mb-1">{item.title}</p>
            <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* How to sell */}
      <h2 className="text-base font-bold text-[#1a1a2e] mb-2">
        How to Sell Your Old Gadget on HelloFi
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Selling your old phone or laptop on HelloFi takes under 5 minutes. Here
        is exactly how it works:
      </p>
      <div className="flex flex-col gap-4 mb-10">
        {[
          {
            step: "Step 1 — Select your device",
            desc: "Choose from mobiles, laptops, tablets, MacBooks, smartwatches, or other gadgets. Pick your brand and model from our list.",
          },
          {
            step: "Step 2 — Get an instant price",
            desc: "Answer a few simple questions about your device's condition — age, screen, battery, accessories. Our system generates a real-time instant price. Instantly. No calls. No negotiations.",
          },
          {
            step: "Step 3 — Schedule a free pickup",
            desc: "Pick a date and time that suits you. Our certified pickup executive comes to your home, office, or any location nearby. It's a completely free service.",
          },
          {
            step: "Step 4 — Get paid immediately",
            desc: "Our executive inspects the device in pickup. Once confirmed, you receive instant payment via UPI, bank transfer, or cash — right at your doorstep.",
          },
        ].map((item, i) => (
          <div key={i} className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
              {i + 1}
            </div>
            <div>
              <p className="text-sm font-bold text-black mb-0.5">{item.step}</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* What types of devices */}
      <h2 className="text-base font-bold text-black mb-2">
        What Types of Devices Can Be Sold on HelloFi?
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        HelloFi accepts all types of used gadgets across every major brand to
        help sellers make sales. Use our category to get an instant price.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2  gap-4 mb-10">
        {[
          {
            title: "Sell Old Mobiles",
            desc: "Get the best resale price for used Apple iPhones, Samsung, OnePlus, Vivo, OPPO, Realme, Mi, Nothing, Google Pixel and stock.",
          },
          {
            title: "Sell Old Tablets",
            desc: "We also buy used Apple iPad, Samsung Tab, OnePlus Pad, Lenovo Tab, or any other brand.",
          },
          {
            title: "Sell Old Smartwatches",
            desc: "Sell used Apple Watch & Samsung Galaxy Watch.",
          },
          {
            title: "Sell Old Laptops",
            desc: "Sell used Dell, HP, Lenovo, Asus, Acer, MI, Apple MacBook, or any other laptop brand at instant price, free pickup.",
          },
          {
            title: "Sell Old MacBooks",
            desc: "Best resale price for used Apple MacBook Air and Apple MacBook Pro — all generations including M1, M2, M3 and Intel models.",
          },
          {
            title: "Sell Other Gadgets",
            desc: "Cameras, gaming consoles, earbuds, iMac mini, Mac studio and more. Can't find yours? Submit a request above.",
          },
        ].map((item) => (
          <div key={item.title} className="w-full lg:w-3/4">
            <p className="text-sm font-bold text-black mb-1">{item.title}</p>
            <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Serviceable areas */}
      <div className="bg-card-surface border border-card-border rounded-xl py-4 mb-10">
        <h2 className="text-base font-bold text-black mb-2 text-center">
          Serviceable areas where HelloFi provides services
        </h2>
        <p className="text-xs text-gray-400 text-center mb-4">
          We are looking forward to expanding our operations to more cities
          soon.
        </p>
        <div className="flex flex-wrap justify-center gap-2 ">
          {[
            "Bangalore",
            "Hyderabad",
            "Mysore",
            "Mumbai",
            "Bhubaneswar",
            "Cuttack",
            "Nagaland",
            "Agra",
            "Agartala",
          ].map((city) => (
            <span
              key={city}
              className="border border-gray-200 bg-white rounded-full px-4 py-1 text-xs font-medium text-gray-600 hover:border-primary hover:text-primary cursor-pointer transition-colors"
            >
              {city}
            </span>
          ))}
        </div>
      </div>

      {/* Buy certified */}
      <h2 className="text-base font-bold text-black mb-2">
        Buy Certified secondhand Mobile Phones, Tablets & Laptops, MacBooks and
        Smartwatches.
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Looking to buy trusted secondhand gadgets online? All gadgets are
        quality-checked, examined, and priced at 30-60% less than new.
      </p>
      <p className="text-sm text-gray-500 mb-4">
        Every preowned device on HelloFi goes through a thorough multi-point
        quality check before listing. This is what you get:
      </p>
      <div className="border border-gray-200 bg-card-surface rounded-2xl p-6 mb-10">
        <div className="flex flex-col gap-2.5">
          {[
            "40-Point Quality Checks",
            'We say "Yes to Refurbishment" Strictly Preowned with No Repair History.',
            "Brand Warranty or 3 Months HelloFi Service Warranty on every purchase.",
            "GST Invoice provided with every order.",
            "Delivery across India.",
            "Most of the devices come with Original Box, Accessories and Bill.",
          ].map((point) => (
            <div key={point} className="flex items-start gap-2.5">
              <div className="w-4 h-4 rounded-full   text-success flex items-center justify-center  mt-0.5">
                <CircleCheck />
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{point}</p>
            </div>
          ))}
        </div>
      </div>

      {/* What types can be bought */}
      <h2 className="text-base font-bold text-[#1a1a2e] mb-4">
        What types of devices can be bought from HelloFi?
      </h2>
      <div className="flex flex-col gap-5">
        {[
          {
            title: "Buy Old Mobile Phones:",
            desc: "You can buy used Apple iPhones, Samsung, OnePlus, Vivo OPPO, Realme, MI, Nothing, Motorola, Google Pixel and more.",
          },
          {
            title: "Buy Secondhand Laptops:",
            desc: "You can buy used Dell, HP, Lenovo, Asus, Acer, MI, Apple laptops.",
          },
          {
            title: "Buy Used Tablets:",
            desc: "We offer old Apple iPad, Samsung Tab, OnePlus Pad, Lenovo Tab, Android tablets at best price.",
          },
          {
            title: "Buy Old Apple MacBooks:",
            desc: "You can buy used Apple MacBook Air and Apple MacBook Pro — all generations including M1, M2, M3, M4, M5 and Intel models.",
          },
          {
            title: "Buy Used Smartwatches:",
            desc: "You can buy used Apple Watch & Samsung Galaxy Watch at best prices.",
          },
        ].map((item) => (
          <div key={item.title}>
            <p className="text-sm font-bold text-[#1a1a2e] mb-1">
              {item.title}
            </p>
            <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
