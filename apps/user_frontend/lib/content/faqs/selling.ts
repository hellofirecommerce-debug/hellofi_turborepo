export interface FAQ {
  id: number;
  question: string;
  answer: string;
}

export const sellingFAQs: Record<string, FAQ[]> = {
  "mobile-phone": [
    {
      id: 1,
      question: "How do I sell my used mobile phone online for the best price?",
      answer:
        "Select your brand and model on HelloFi, enter your storage, ram, phone age, accessories available and condition accurately, and get your instant resale price. For the best price, ensure your phone is clean, the screen has no cracks, all functions and ports are working, and you select the condition that honestly reflects your phone. Free doorstep pickup and instant payment at pickup are included with every sale.",
    },
    {
      id: 2,
      question: "How long does the pickup and payment process take?",
      answer:
        "Once you confirm your price, our pickup partner reaches your address on the same day or the next day depending on your slot, verifies the phone against the details you provided, and pays you instantly on the spot — no waiting for bank transfers or delayed settlements.",
    },
    {
      id: 3,
      question:
        "Can I sell a mobile phone without the original box or charger?",
      answer:
        "Yes, you can still sell your phone without the original box, charger, or other accessories. Just select the accessories you actually have during the quote process — this may affect the final price slightly since a complete box typically fetches a better resale value.",
    },
    {
      id: 4,
      question: "Can I sell a phone with a cracked screen?",
      answer:
        "Yes, HelloFi accepts phones with a cracked screen or other cosmetic and functional issues. Select the condition that matches your phone honestly during the quote process, and you'll receive a fair price reflecting its actual condition.",
    },
    {
      id: 5,
      question: "Is doorstep pickup free?",
      answer:
        "Yes, doorstep pickup is completely free across all serviceable locations. There are no hidden charges for pickup, inspection, or payment — the price quoted to you is the price you receive, provided the phone matches the details submitted.",
    },
    {
      id: 6,
      question: "What payment methods does HelloFi offer?",
      answer:
        "HelloFi offers instant payment at the time of pickup via UPI, bank transfer, or cash, based on your preference. You'll receive the agreed amount as soon as our team verifies your phone's condition on the spot.",
    },
    {
      id: 7,
      question: "Can I sell multiple phones in one pickup?",
      answer:
        "Yes, you can add multiple phones to a single pickup request. Simply generate a quote for each device separately, and our pickup partner will collect and verify all of them together during the same visit, with payment made for each device individually.",
    },
    {
      id: 8,
      question: "How do I check my phone's battery health before selling?",
      answer:
        "On iPhone, go to Settings > Battery > Battery Health & Charging to see your maximum capacity percentage. On Android, this varies by manufacturer — check Settings > Battery, or use a manufacturer-provided diagnostics app. Enter this accurately for the most precise quote.",
    },
    {
      id: 9,
      question: "What's the difference between resale and buyback?",
      answer:
        "Resale (or selling) means you're giving up your device permanently for an immediate cash payout, which is what HelloFi offers. Buyback or exchange programs typically apply the value of your old device as a discount toward a new purchase instead of cash in hand.",
    },
    {
      id: 10,
      question: "Where can I sell my old smartphone?",
      answer:
        "You can sell your old smartphone directly through HelloFi's website or app — get an instant quote, schedule a free doorstep pickup, and receive payment on the spot. No need to visit a store or deal with third-party marketplaces.",
    },
    {
      id: 11,
      question: "Where is the Best Place to Sell Old Phone for Cash Easily?",
      answer:
        "HelloFi is designed to make selling your old phone for cash fast and hassle-free — get an instant online quote, book a free doorstep pickup, and receive payment immediately once your phone is verified, all without stepping out of your home.",
    },
    {
      id: 12,
      question: "What documents do I need to sell my phone on HelloFi?",
      answer:
        "You'll typically need a valid government-issued ID for verification at the time of pickup, along with the phone's original purchase invoice if available (though not mandatory). Our pickup partner will guide you through any additional requirements on-site.",
    },
  ],
};
