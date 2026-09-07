// components/category-page/seperate-category/CategorySeoContentSection.tsx

interface ParagraphBlock {
  type: "paragraph";
  heading?: string;
  text: string;
}

interface BulletBlock {
  type: "bullets";
  heading: string;
  items: string[];
}

type ContentBlock = ParagraphBlock | BulletBlock;

interface SeoContent {
  heading: string;
  blocks: ContentBlock[];
}

const SEO_CONTENT: Record<string, SeoContent> = {
  laptop: {
    heading: "The HelloFi Advantage",
    blocks: [
      {
        type: "paragraph",
        text: "Every Secondhand Laptops and Preowned Apple MacBooks are thoroughly tested, securely data wiped, and quality checked before listing. We use actual product photos, provide honest cosmetic grading like Open Box, Superb, Good, Fair and clearly disclose the device's condition. If a device has undergone an authorized repair, we also share the official service report for complete transparency.",
      },
      {
        type: "paragraph",
        text: "Buying a secondhand MacBook doesn't have to be a gamble. With HelloFi, you get verified quality, transparent listings, latest collections, secure payments, and expert assistance before and after purchase.",
      },
      {
        type: "paragraph",
        text: "HelloFi is India's most trusted platform to buy preowned laptops, Apple MacBooks online. HelloFi makes it easy to buy used laptops online in India. Explore huge collection of second hand Gaming Laptops and Apple MacBooks. We list laptops across all major brands, including Apple, Dell, Lenovo, Asus, Hp, Acer, Samsung, Msi and many more. Many laptops include the original box, charger, first owner invoice, mandatory HelloFi GST Bill and remaining brand warranty making it easy to own a premium laptop/Apple MacBook with complete confidence.",
      },
      {
        type: "bullets",
        heading: "The Future of Preowned Laptops and Apple MacBooks in India",
        items: [
          "Preowned laptop demand is rising as new device prices climb.",
          "Students and professionals are buying used over new.",
          "Apple's preowned share is growing since it's the cheapest way into the Apple ecosystem.",
          "Warranty backed platform like HelloFi are replacing risky classifieds purchases.",
        ],
      },
      {
        type: "bullets",
        heading: "How to Choose the Right Secondhand Laptop",
        items: [
          "Check battery health/cycle count.",
          "Inspect screen for dead pixels or discolouration.",
          "Check hinge and body for damage.",
          "Test all ports, keyboard, trackpad.",
          "Verify serial number isn't blacklisted.",
          "Confirm RAM/storage matches listing.",
          "Ask about original bill/GST bill.",
          "Confirm warranty and return window.",
          "Make sure OS is genuine, not pirated.",
        ],
      },
    ],
  },
  tablet: {
    heading: "Why Tablets Are Becoming More Popular Than Ever",
    blocks: [
      {
        type: "paragraph",
        text: "Over the past few years, tablets have evolved into devices that comfortably fit between smartphones and laptops. They combine portability with productivity, making them ideal for users who want a larger screen without carrying a full-sized computer.",
      },
      {
        type: "paragraph",
        text: "Modern tablets are now used for far more than watching videos. Students annotate PDFs directly on their screens, doctors carry digital medical records during rounds, architects review blueprints on-site, photographers edit images while travelling, and business professionals conduct presentations without carrying heavy laptops. This versatility is exactly why preowned tablets continue to attract students, professionals, creators and families alike.",
      },
      {
        type: "paragraph",
        text: "One of the biggest mistakes buyers make is comparing a budget new tablet with a premium preowned tablet solely on the basis of age. In reality, a flagship tablet from a previous generation often delivers a significantly better overall experience than an entry-level brand-new device available at a similar price.",
      },
      {
        type: "bullets",
        heading: "We Recommend a Preowned Tablet Because It Generally Offers",
        items: [
          "Faster processors",
          "Better displays",
          "Superior speakers",
          "Longer software support",
          "Better cameras",
          "Premium metal construction",
          "Advanced stylus compatibility",
          "Higher resale value",
          "More reliable long-term performance",
        ],
      },
      {
        type: "paragraph",
        text: "Instead of compromising on speed and display quality, buyers can own devices originally designed for professionals, creators and power users. For many people, buying preowned is not about settling for less — it's about upgrading to something better within the same budget.",
      },
      {
        type: "paragraph",
        heading: "Can a Tablet Replace Your Laptop?",
        text: "For many users, the answer is yes. If your daily work involves emails, browsing, note taking, video meetings, presentations, streaming, reading documents or online classes, a modern tablet can comfortably replace a laptop. When paired with a keyboard and stylus, premium tablets become highly capable productivity devices while remaining considerably lighter than traditional laptops.",
      },
      {
        type: "bullets",
        heading:
          "A Tablet Is an Excellent Replacement for a Laptop If You Primarily",
        items: [
          "Attend online meetings",
          "Take handwritten notes",
          "Read and annotate PDFs",
          "Reply to emails",
          "Prepare presentations",
          "Browse the web",
          "Watch educational content",
          "Stream movies and shows",
          "Create illustrations",
          "Edit social media content",
        ],
      },
      {
        type: "paragraph",
        text: "However, users performing intensive software development, high-end video rendering or advanced engineering workloads may still benefit from a dedicated laptop. Instead of replacing laptops entirely, many professionals now use tablets as lightweight companion devices that allow them to stay productive anywhere.",
      },
      {
        type: "paragraph",
        heading:
          "Why More Buyers Are Choosing HelloFi for Preowned Tablets Instead of Classified Marketplaces",
        text: "Buying technology from an unknown seller often involves uncertainty. Device history may be unclear, accessories may be missing and there is rarely any meaningful support after the sale. Trusted preowned platforms like HelloFi provide a different experience by prioritising transparency and quality. Instead of relying on assumptions, buyers can make informed decisions with clear condition grading, verified functionality and documented inspections. In addition, you get a wide collection of the latest Apple iPads and premium preowned Android tablets from leading brands like Samsung, OnePlus, Lenovo, and Motorola — with free doorstep delivery across PAN India, exciting discounts, exclusive checkout offers, and easy EMI options.",
      },
      {
        type: "paragraph",
        heading: "A) Honest Condition Grading You Can Actually Trust",
        text: "One of the biggest frustrations when buying used electronics is receiving a device that looks nothing like its photographs. HelloFi follows a transparent grading system designed to set realistic expectations before you place an order.",
      },
      {
        type: "paragraph",
        heading: "B) Actual Product Photos. No Surprises.",
        text: "Many online companies display catalogue images that fail to represent the actual device arriving at your doorstep. At HelloFi, we use photographs of the actual tablet whenever possible, allowing buyers to inspect the cosmetic condition before placing an order.",
      },
      {
        type: "paragraph",
        heading: "C) More Than Just a Warranty",
        text: "A warranty is important but genuine customer support matters even more. Eligible devices are backed by Brand Warranty or HelloFi Service Warranty, along with dedicated customer assistance to help resolve any concerns after purchase.",
      },
      {
        type: "paragraph",
        heading: "D) Original Accessories with Genuine Purchase Documentation",
        text: "Every product is mandatorily supplied with a HelloFi GST Invoice. Additionally, most devices include the original accessories and the first owner's purchase bill (where available), giving you greater confidence in the product's authenticity, ownership history, and value.",
      },
      {
        type: "paragraph",
        heading: "E) Transparency Matters More Than Discounts",
        text: "The cheapest tablet isn't always the best value. Many buyers discover hidden issues only after receiving their device — poor battery performance, inaccurate descriptions, replaced components or undisclosed defects. At HelloFi, we focus on honest pricing instead of unrealistic discounts.",
      },
      {
        type: "bullets",
        heading: "Every Listing Clearly Communicates",
        items: [
          "Cosmetic condition",
          "Storage capacity",
          "Accessories included",
          "Warranty availability",
          "Device photographs",
          "Product specifications",
        ],
      },
      {
        type: "bullets",
        heading:
          "Why Buying a Preowned Tablet from HelloFi Is Better for the Environment",
        items: [
          "Extends Device Life: Every preowned tablet sold by HelloFi stays in use longer instead of becoming electronic waste.",
          "Reduces E-Waste: Reusing existing tablets helps reduce the number of devices ending up in landfills.",
          "Saves Natural Resources: Buying preowned lowers the demand for new raw materials such as lithium, aluminium, copper, and rare earth metals.",
          "Cuts Carbon Emissions: Reusing a tablet avoids much of the carbon footprint involved in manufacturing a brand-new device.",
          "Less Manufacturing Waste: Every preowned purchase reduces the need for new production, packaging, and factory resources.",
          "Supports a Circular Economy: HelloFi gives quality tablets a second life, promoting responsible consumption instead of unnecessary replacement.",
          "A Smarter Sustainable Choice: You get a reliable tablet while making an environmentally responsible purchase without compromising on quality.",
        ],
      },
      {
        type: "paragraph",
        text: "Choosing a preowned tablet is an environmentally responsible decision. India generates over 1.7 million tonnes of e-waste every year, making it one of the world's largest e-waste producers. Extending the life of a working tablet helps reduce unnecessary electronic waste and supports a more sustainable, circular economy. Manufacturing a new tablet requires mining valuable materials such as lithium, aluminium, copper and gold, along with thousands of litres of water and significant energy. By reusing an existing device, you reduce the demand for new manufacturing and help conserve these limited natural resources.",
      },
      {
        type: "paragraph",
        heading: "What Makes a Great Preowned Tablet?",
        text: "When buying a preowned tablet, most buyers focus on specifications such as RAM, processor or storage. While these are important, they don't tell the complete story. A great tablet is one that delivers a smooth, dependable experience every day — not just impressive numbers on paper. That's why HelloFi evaluates every tablet from a real-world usability perspective, checking how it performs during everyday tasks such as note taking, video streaming, multitasking, drawing, browsing, video calls and charging.",
      },
      {
        type: "bullets",
        heading: "What We Actually Check",
        items: [
          "Does the touchscreen respond accurately across the entire display?",
          "Does the battery comfortably last through a day's normal usage?",
          "Are the speakers producing balanced sound?",
          "Is the display free from distracting defects?",
          "Do the cameras function properly for video calls?",
          "Are all sensors, buttons and ports working correctly?",
          "Does the software operate smoothly without unexpected crashes?",
        ],
      },
    ],
  },
  "smart-watch": {
    heading: "Why Premium Smartwatches Are Changing Everyday Life",
    blocks: [
      {
        type: "paragraph",
        text: "Just a few years ago, smartwatches were considered optional gadgets. Today, they have become an integral part of everyday life for students, professionals, fitness enthusiasts, travellers, entrepreneurs, and even senior citizens.",
      },
      {
        type: "paragraph",
        text: "Modern premium smartwatches are designed to do far more than display notifications. They help users understand their health, stay active, improve productivity, and remain connected wherever they go. For many people, their smartwatch becomes the first device they check every morning and the last device they rely on before going to sleep.",
      },
      {
        type: "bullets",
        heading: "A Personal Health Companion on Your Wrist",
        items: [
          "Heart Rate Monitoring",
          "ECG (Electrocardiogram)",
          "Blood Oxygen Monitoring",
          "Sleep Tracking",
          "Stress Monitoring",
          "Skin Temperature Monitoring",
          "Fall Detection",
          "Emergency SOS",
          "Irregular Heart Rhythm Notifications",
        ],
      },
      {
        type: "bullets",
        heading: "Stay Connected Without Constantly Using Your Phone",
        items: [
          "Receive calls",
          "Reply to messages",
          "Read emails",
          "View calendar reminders",
          "Control music",
          "Navigate using maps",
          "Make contactless payments (supported models)",
          "Receive app notifications",
        ],
      },
      {
        type: "bullets",
        heading: "Designed for Fitness and Active Lifestyles",
        items: [
          "GPS Workout Tracking",
          "Running Metrics",
          "Cycling Analysis",
          "Swimming Tracking",
          "Strength Training",
          "HIIT Detection",
          "Step Counting",
          "Calories Burned",
          "Distance Tracking",
          "Workout History",
        ],
      },
      {
        type: "bullets",
        heading: "A Productivity Tool for Busy Professionals",
        items: [
          "Join meetings on time with reminders",
          "Receive business notifications instantly",
          "Accept important calls",
          "Control presentations",
          "View schedules",
          "Manage reminders",
          "Track travel directions",
          "Stay connected without constantly checking their smartphones",
        ],
      },
      {
        type: "bullets",
        heading: "Built to Last for Years",
        items: [
          "Sapphire Crystal Protection (selected models)",
          "Stainless Steel or Titanium Construction",
          "Bright AMOLED Displays",
          "Water Resistance",
          "Faster Processors",
          "Better Battery Optimisation",
          "Longer Software Support",
          "Advanced Wireless Connectivity",
        ],
      },
      {
        type: "paragraph",
        text: "Buying these premium devices as preowned allows customers to enjoy flagship quality without paying flagship prices.",
      },
      {
        type: "bullets",
        heading: "Better Value Than Buying a New Budget Smartwatch",
        items: [
          "Premium displays",
          "Faster processors",
          "Better health sensors",
          "Superior GPS accuracy",
          "More reliable software",
          "Longer product lifespan",
          "Higher resale value",
          "Better ecosystem integration",
        ],
      },
      {
        type: "paragraph",
        text: "For many users, purchasing a premium preowned smartwatch is not about compromising — it's about upgrading to a much better experience within the same budget.",
      },
      {
        type: "bullets",
        heading: "24×7 Heart Health Monitoring",
        items: [
          "Continuous heart rate tracking",
          "High & low heart rate alerts",
          "Irregular rhythm notifications",
          "ECG support (on compatible models)",
        ],
      },
      {
        type: "bullets",
        heading: "Advanced Sleep Tracking",
        items: [
          "Sleep duration analysis",
          "Sleep stage monitoring",
          "Night-time heart rate tracking",
          "Recovery and sleep consistency insights",
        ],
      },
      {
        type: "bullets",
        heading: "Track 100+ Workout Modes",
        items: [
          "Walking",
          "Running",
          "Cycling",
          "Swimming",
          "Strength Training",
          "Yoga",
          "HIIT",
          "Hiking",
          "Functional Training",
        ],
      },
      {
        type: "bullets",
        heading: "HelloFi Quality Assurance",
        items: [
          "Thoroughly tested display, sensors, buttons, charging, and connectivity",
          "Ensures reliable access to all premium health and fitness features on compatible preowned smartwatches",
        ],
      },
    ],
  },
};

interface Props {
  categorySlug: string;
}

export function CategorySeoContentSection({ categorySlug }: Props) {
  const content = SEO_CONTENT[categorySlug];

  if (!content) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 w-full py-8 sm:py-10">
      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-black mb-5 sm:mb-6">
        {content.heading}
      </h2>

      <div className="flex flex-col gap-5 sm:gap-6">
        {content.blocks.map((block, i) =>
          block.type === "paragraph" ? (
            <div key={i}>
              {block.heading && (
                <h3 className="text-sm sm:text-base font-bold text-black mb-2">
                  {block.heading}
                </h3>
              )}
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed text-justify w-full">
                {block.text}
              </p>
            </div>
          ) : (
            <div key={i}>
              <h3 className="text-sm sm:text-base font-bold text-black mb-2">
                {block.heading}
              </h3>
              <ul className="flex flex-col gap-1.5">
                {block.items.map((item, j) => (
                  <li
                    key={j}
                    className="text-xs sm:text-sm text-gray-500 leading-relaxed pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-primary"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
