interface DefinitionItem {
  question: string;
  answer: string;
}

interface GuideStep {
  title: string;
  items: string[];
}

interface LifestyleCard {
  title: string;
  items?: string[];
  description?: string;
  recommendation?: string;
}

interface EvaluationItem {
  title: string;
  text: string;
}

interface GuideContent {
  definitions?: DefinitionItem[];
  intro?: string;
  stepsHeading?: string;
  steps?: GuideStep[];
  choiceHeading?: string;
  choiceIntro?: string;
  choiceCards?: LifestyleCard[];
  lifestyleHeading?: string;
  lifestyleCards?: LifestyleCard[];
  evaluationHeading?: string;
  evaluationIntro?: string;
  evaluationItems?: EvaluationItem[];
}

const GUIDE_CONTENT: Record<string, GuideContent> = {
  "smart-watch": {
    definitions: [
      {
        question: "What is a Preowned Smartwatch?",
        answer:
          "A preowned smartwatch is a previously owned smartwatch that is tested for quality and functionality, verified for authenticity and sold in good working condition at a lower price.",
      },
      {
        question: "How is it different from Refurbished?",
        answer:
          "A preowned smartwatch is sold in its original condition after quality checks, while a refurbished smartwatch has been repaired, refurbished, or had parts replaced before resale.",
      },
      {
        question: "What is Seller Warranty?",
        answer:
          "A seller warranty is a warranty provided by the seller that covers functional issues for a specified period after purchase, subject to the warranty terms.",
      },
      {
        question: "What is Cosmetic Grade?",
        answer:
          "Cosmetic grade indicates the physical appearance of the smartwatch, such as scratches or signs of use, without affecting its performance or functionality.",
      },
    ],
    intro:
      "Buying a preowned smartwatch isn't just about saving money — it's about choosing one that fits your smartphone, lifestyle, and daily needs.",
    stepsHeading: "How to Choose the Right Preowned Smartwatch",
    steps: [
      {
        title: "1. Check Smartphone Compatibility",
        items: [
          "iPhone users: Choose a Preowned Apple Watch for seamless Apple ecosystem integration (e.g. Apple Watch Series 8, 9, 10, 11, Ultra models).",
          "Android users: Choose a Preowned Samsung Galaxy Watch for the best Wear OS and Google services experience (e.g. Samsung Watch 6, 7, 8, Ultra models).",
        ],
      },
      {
        title: "2. Buy Based on Your Lifestyle",
        items: [
          "Fitness & workouts",
          "Running & cycling",
          "Professional use",
          "Outdoor activities",
          "Notifications & calling",
          "Style & everyday wear",
        ],
      },
      {
        title: "3. Prioritise the Health Features You Need",
        items: [
          "Heart-rate monitoring",
          "ECG",
          "Blood Oxygen (SpO₂)",
          "Sleep tracking",
          "Stress monitoring",
          "Skin temperature",
          "GPS tracking",
          "Workout tracking",
          "Fall & Crash Detection",
          "Women's health tracking",
        ],
      },
      {
        title: "4. Select the Right Size",
        items: [
          "Wrist size",
          "Display size",
          "Weight & comfort",
          "Battery capacity",
          "(e.g. Apple Watch Ultra 2 49mm, Samsung Galaxy Watch 8 Classic 46mm)",
        ],
      },
      {
        title: "5. Evaluate Battery Performance",
        items: [
          "Daily notifications",
          "Calls",
          "Health monitoring",
          "GPS workouts",
          "Sleep tracking",
        ],
      },
      {
        title: "6. Buy Only from a Trusted Seller",
        items: [
          "Device verification",
          "Transparent condition grading",
          "Warranty",
          "Original accessories (where available)",
          "GST invoice",
          "Reliable after-sales support",
        ],
      },
      {
        title: "7. Check if You Need Cellular Connectivity or Only GPS",
        items: [
          "(e.g. Apple Watch Series 9 45mm Cellular, Samsung Watch Ultra LTE)",
        ],
      },
    ],
    lifestyleHeading: "Best Smartwatch Recommendations Based on Your Lifestyle",
    lifestyleCards: [
      {
        title: "For Fitness Enthusiasts",
        items: [
          "Accurate workout tracking",
          "GPS & route mapping",
          "Heart-rate monitoring",
          "Recovery insights",
        ],
        recommendation:
          "HelloFi Recommendation: Preowned Apple Watch Series 8, 9, Apple Watch Ultra, Preowned Samsung Galaxy Watch.",
      },
      {
        title: "For Working Professionals",
        items: [
          "Calendar reminders",
          "Call & message management",
          "Voice assistant",
          "Contactless payments",
          "Navigation",
        ],
        recommendation:
          "HelloFi Recommendation: Preowned Apple Watch Series 7, 8, Preowned Samsung Galaxy Watch 7, 8.",
      },
      {
        title: "For Runners & Cyclists",
        items: [
          "Multi-band GPS",
          "Pace & distance tracking",
          "Elevation data",
          "Heart-rate zones",
          "Training & recovery insights",
        ],
        recommendation:
          "HelloFi Recommendation: Preowned Apple Watch Series 9, 10, 11, Apple Watch Ultra 2, Preowned Samsung Galaxy Watch 8, Ultra.",
      },
      {
        title: "For Health-Conscious Users",
        items: [
          "Heart-rate monitoring",
          "ECG support",
          "Sleep tracking",
          "Stress monitoring",
          "Activity reminders",
        ],
        recommendation:
          "HelloFi Recommendation: Preowned Apple Watch Series 10, 11, Apple Watch Ultra 2, 3, Preowned Samsung Galaxy Watch 8, Ultra.",
      },
      {
        title: "For Frequent Travellers",
        items: [
          "Offline maps",
          "Flight notifications",
          "Contactless payments",
          "Weather updates",
          "Music controls",
          "Multiple time zones",
        ],
        recommendation:
          "HelloFi Recommendation: Preowned Apple Watch Series 8, 9, 10, Preowned Samsung Galaxy Watch 7, 8.",
      },
      {
        title: "For Senior Family Members",
        items: [
          "Emergency SOS",
          "Fall Detection",
          "Health monitoring",
          "Medication reminders",
          "Daily activity tracking",
        ],
        recommendation:
          "HelloFi Recommendation: Preowned Apple Watch Series 10, 11, Apple Watch Ultra, Preowned Samsung Galaxy Watch 7, 8, Ultra.",
      },
    ],
    evaluationHeading:
      "Every HelloFi Smartwatch Passes Our Wearable Performance Evaluation",
    evaluationIntro:
      "Every preowned smartwatch at HelloFi undergoes a comprehensive quality inspection to ensure reliable everyday performance.",
    evaluationItems: [
      {
        title: "Display",
        text: "Touch response, brightness, colour accuracy, dead pixels, burn-in and screen condition.",
      },
      { title: "Battery", text: "Assessed for dependable daily usage." },
      {
        title: "Health Sensors",
        text: "Heart rate, SpO₂, ECG, temperature and other supported sensors.",
      },
      {
        title: "Connectivity",
        text: "Bluetooth, Wi-Fi, GPS, NFC (where available), calling, speaker and microphone.",
      },
      {
        title: "Physical Condition",
        text: "Buttons, Digital Crown/Bezel, charging contacts, casing, strap fitment and water damage indicators.",
      },
      {
        title: "Software",
        text: "Securely reset, smooth performance, successful pairing and ready for setup.",
      },
    ],
  },
  tablet: {
    choiceHeading:
      "Apple iPad or Android Tablet – Which One Should You Choose?",
    choiceIntro:
      "One of the most common questions buyers ask is whether they should purchase a secondhand Apple iPad or a preowned Android tablet. The answer depends entirely on how you plan to use it.",
    choiceCards: [
      {
        title: "Choose a Preowned Apple iPad If You:",
        items: [
          "Already use an iPhone or MacBook.",
          "Want industry leading app optimisation.",
          "Prefer long software update support.",
          "Need exceptional stylus performance with Apple Pencil.",
          "Edit photos or videos regularly.",
          "Value strong resale prices.",
          "Want a smooth experience for years.",
          "Want better security and privacy.",
          "Want smooth and faster performance.",
        ],
        recommendation:
          "Apple's ecosystem allows iPads to work seamlessly with iPhones, Macs and AirPods, making them especially attractive for users already invested in Apple products.",
      },
      {
        title: "Choose a Preowned Android Tablet If You:",
        items: [
          "Prefer greater customisation.",
          "Need expandable storage (on supported models).",
          "Want larger displays at competitive prices.",
          "Enjoy multitasking with split-screen features.",
          "Use Google's productivity ecosystem extensively.",
          "Want excellent entertainment and gaming experiences.",
        ],
        recommendation:
          "Manufacturers such as Samsung, Lenovo, OnePlus and Motorola have significantly improved Android tablets in recent years, offering productivity features that rival traditional laptops.",
      },
    ],
    intro:
      "Buying a preowned tablet is easy when you know what to check. At HelloFi, every tablet is inspected for performance, condition, and reliability so you can buy with confidence.",
    stepsHeading: "How to Choose the Right Preowned Tablet",
    steps: [
      {
        title: "Step 1 — Get More Value",
        items: [
          "At HelloFi, you will find the best preowned tablet within your budget, so you get more value than buying a new budget tablet.",
        ],
      },
      {
        title: "Step 2 — Choose a Trusted Brand",
        items: [
          "We offer carefully selected Apple iPads, Samsung Galaxy Tablets and other Android tablets from Lenovo, OnePlus, Motorola and more, making it easy to choose a trusted brand that fits your needs.",
        ],
      },
      {
        title: "Step 3 — Pick the Right Storage",
        items: [
          "64GB is suitable for everyday use, while 128GB or more is ideal for apps, photos, videos, and work files.",
        ],
      },
      {
        title: "Step 4 — Select the Right Screen",
        items: [
          "Select the right screen size and quality for your needs. Every display is carefully checked to ensure it is free from major defects and delivers a great viewing experience.",
        ],
      },
      {
        title: "Step 5 — Check Battery Health",
        items: [
          "Battery health is important for long-term use. HelloFi checks battery performance so your tablet is ready for daily tasks without unexpected issues.",
        ],
      },
      {
        title: "Step 6 — Confirm Warranty",
        items: [
          "Always buy a preowned tablet with warranty support. HelloFi provides warranty coverage for eligible devices, giving you extra peace of mind after your purchase.",
        ],
      },
      {
        title: "Step 7 — Check Accessories",
        items: [
          "Check what's included in the box. HelloFi clearly mentions the accessories provided, such as the charging adapter and cable, so you know exactly what you are getting.",
        ],
      },
    ],
    lifestyleHeading:
      "Best Tablets for Students, Artists, Professionals, Business Users & Families",
    lifestyleCards: [
      {
        title: "Best Tablets For Students",
        description:
          "A tablet transforms the way students learn. Digital note-taking, PDF annotation, online classes, educational apps and cloud storage reduce the need to carry multiple notebooks while keeping study material organised in one place.",
        recommendation:
          "HelloFi Recommendation: Apple iPad 10th Gen, iPad Air 4th Gen, Samsung Galaxy Tab S9.",
      },
      {
        title: "Best Tablets For Artists & Designers",
        description:
          "Creative professionals require accurate displays, low-latency stylus input and software capable of handling illustrations, graphic design and digital painting.",
        recommendation:
          "HelloFi Recommendation: Apple iPad Pro 4th Gen M2, Apple iPad Air M3, Samsung Galaxy S10 Plus, S10 Ultra with S Pen.",
      },
      {
        title: "Best Tablets For Business Professionals",
        description:
          "Professionals increasingly rely on tablets for meetings, presentations, document review, digital signatures and remote collaboration — staying productive whether in the office, at home or travelling.",
      },
      {
        title: "For Entertainment Enthusiasts",
        description:
          "Large displays, immersive speakers and long battery life make premium tablets ideal for streaming movies, watching sports, reading eBooks and casual gaming.",
        recommendation:
          "HelloFi Recommendation: iPad Pro M4 13-inch, iPad Air M3 13-inch, Samsung S9 Ultra.",
      },
      {
        title: "Best Tablets For Families",
        description:
          "A single tablet often becomes a shared device used for children's learning, family video calls, recipe viewing in the kitchen, entertainment during trips and everyday browsing.",
      },
    ],
  },
};

interface Props {
  categorySlug: string;
}

export function BuyingGuideSection({ categorySlug }: Props) {
  const content = GUIDE_CONTENT[categorySlug];

  if (!content) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 w-full py-8 sm:py-10 flex flex-col gap-10 sm:gap-12">
      {/* Definitions */}
      {content.definitions && content.definitions.length > 0 && (
        <div className="flex flex-col gap-5 sm:gap-6">
          {content.definitions.map((def) => (
            <div key={def.question}>
              <h3 className="text-sm sm:text-base font-bold text-black mb-1.5">
                {def.question}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                {def.answer}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* iPad vs Android choice */}
      {content.choiceHeading && content.choiceCards && (
        <div>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-black mb-3">
            {content.choiceHeading}
          </h2>
          {content.choiceIntro && (
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-5 sm:mb-6">
              {content.choiceIntro}
            </p>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            {content.choiceCards.map((card) => (
              <div
                key={card.title}
                className="bg-white border border-card-border rounded-xl p-4 sm:p-5 flex flex-col gap-2"
              >
                <p className="text-sm sm:text-base font-bold text-black">
                  {card.title}
                </p>
                {card.items && (
                  <ul className="flex flex-col gap-1">
                    {card.items.map((item, i) => (
                      <li
                        key={i}
                        className="text-xs sm:text-sm text-gray-500 leading-relaxed pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-primary"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
                {card.recommendation && (
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mt-1">
                    {card.recommendation}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* How to Choose steps */}
      {content.stepsHeading && content.steps && (
        <div>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-black mb-3">
            {content.stepsHeading}
          </h2>
          {content.intro && (
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-5 sm:mb-6">
              {content.intro}
            </p>
          )}
          <div className="flex flex-col gap-4 sm:gap-5">
            {content.steps.map((step) => (
              <div key={step.title}>
                <h3 className="text-sm sm:text-base font-bold text-black mb-2">
                  {step.title}
                </h3>
                <ul className="flex flex-col gap-1.5">
                  {step.items.map((item, i) => (
                    <li
                      key={i}
                      className="text-xs sm:text-sm text-gray-500 leading-relaxed pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-primary"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lifestyle Recommendations */}
      {content.lifestyleHeading && content.lifestyleCards && (
        <div>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-black mb-5 sm:mb-6">
            {content.lifestyleHeading}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {content.lifestyleCards.map((card) => (
              <div
                key={card.title}
                className="bg-white border border-card-border rounded-xl p-4 sm:p-5 flex flex-col gap-2"
              >
                <p className="text-sm sm:text-base font-bold text-black">
                  {card.title}
                </p>
                {card.description && (
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {card.description}
                  </p>
                )}
                {card.items && (
                  <ul className="flex flex-col gap-1">
                    {card.items.map((item, i) => (
                      <li
                        key={i}
                        className="text-xs text-gray-500 leading-relaxed pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-primary"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
                {card.recommendation && (
                  <p className="text-xs font-semibold text-primary mt-1">
                    {card.recommendation}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quality Evaluation */}
      {content.evaluationHeading && content.evaluationItems && (
        <div>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-black mb-2">
            {content.evaluationHeading}
          </h2>
          {content.evaluationIntro && (
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-5 sm:mb-6">
              {content.evaluationIntro}
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {content.evaluationItems.map((item) => (
              <div
                key={item.title}
                className="bg-white border border-card-border rounded-xl p-4 sm:p-5"
              >
                <p className="text-sm sm:text-base font-bold text-black mb-1.5">
                  {item.title}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
