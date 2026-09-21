import type { SellSEOContentItem } from "./types";

export const sellSEOContent: Record<string, SellSEOContentItem> = {
  "mobile-phone": {
    heading:
      "Sell Your Old & Used Mobile Phone Online at Best Price. All Brands, All Models, All Conditions",
    introParagraphs: [
      "Whether you have a flagship Apple iPhone or an entry level budget Android, HelloFi gives you a fair, transparent resale price and picks it up from your door. Lots of sellers across the country use HelloFi every month to convert old smartphones into instant cash, without the haggling of local shops, the uncertainty of OLX, or the last-minute deductions common on other online platforms.",
      "HelloFi buys mobile phones from every brand sold in India — Apple, Samsung, OnePlus, Xiaomi, Redmi, POCO, Vivo, iQOO, OPPO, Realme, Google Pixel, Motorola, Nothing, ASUS ROG and more. Select your brand above to see all available models and get your instant price.",
    ],
    resaleFactorsHeading: "How Mobile Phone Resale Value Is Calculated?",
    resaleFactorsSubtext:
      "Your phone's resale price on HelloFi is calculated in real time based on seven key factors.",
    resaleFactors: [
      {
        title: "Brand",
        description:
          "Premium brands like Apple and Samsung flagship models hold resale value significantly better than budget brands. An iPhone 13 retains 40–45% of its original price after three years. A budget Android from a lesser-known brand may retain 10–15% over the same period.",
      },
      {
        title: "Model and Generation",
        description:
          "The newer the model, the higher the resale value. An iPhone 15 commands more than an iPhone 12 in equivalent condition. A Samsung Galaxy S24 is worth more than a Galaxy S21.",
      },
      {
        title: "Storage Capacity",
        description:
          "Higher storage means higher resale value. A 256GB iPhone 14 is typically worth ₹4,000–₹7,000 more than the same model in 128GB.",
      },
      {
        title: "Physical Condition",
        description:
          "Scratches, dents, a cracked back glass, or a broken frame all reduce resale value. A well-maintained phone always fetches the best possible price.",
      },
      {
        title: "Screen Condition",
        description:
          "The display is the most expensive component in any smartphone. A cracked or deeply scratched screen reduces resale value by 25–40% depending on severity.",
      },
      {
        title: "Battery Health",
        description:
          "Battery health above 80% has minimal price impact. Below 80%, it reduces the quote because buyer factor in a battery replacement cost. Check your battery health before submitting a quote.",
      },
      {
        title: "Accessories and Original Documentation",
        description:
          "Having the original charger, box, and particularly the original invoice adds ₹500–₹2,000 to the typical quote depending on the model. Their absence does not prevent the sale.",
      },
    ],
    cityAvailability: {
      heading: "Sell Your Old Phone in Your City",
      body: "Same day and next day pickup slots are available in Bangalore, Hyderabad, Mumbai, Kolkata, Bhubaneswar, Agartala, Mysore. Enter your pin code at checkout to confirm same day slots near you.",
    },
    trustSection: {
      heading: "Is It Safe to Sell Your Smartphone Online with HelloFi?",
      intro:
        "Selling a phone online comes with legitimate concerns about data privacy, about whether the price quoted is actually the price paid, and about who is coming to your door. Here is how HelloFi addresses each of these directly.",
      points: [
        {
          title: "Your data is protected",
          body: "By the factory reset process. HelloFi guides you through before every pickup. Once a factory reset is completed, no personal data — contacts, photos, WhatsApp messages, banking apps, payment history — remains on the device. Our own executives are trained to verify the reset is complete before proceeding with payment.",
        },
        {
          title: "Your safety is protected",
          body: "By HelloFi's own in house executive programme.",
        },
        {
          title: "Your price is protected",
          body: "By HelloFi's zero-deduction promise. The amount shown on your screen when you complete the quote process is the amount paid at pickup as long as the condition you described matches the phone our executive inspects. No renegotiation at the door, no new conditions discovered on arrival.",
        },
      ],
    },
    aboutHelloFi:
      "India's Most Trusted Destination To Sell Old & Used Gadgets Online. Founded in 2023 by two engineers, HelloFi was created to redefine the way people sell their used gadgets online. We offer a transparent, hassle-free selling experience with fair pricing, professional device inspections, secure transactions, and instant payments — making it easy to sell your device with complete confidence.",
  },

  // laptop: { ... },
  // tablet: { ... },
  // "smart-watch": { ... },
  // accessories: { ... },
};
