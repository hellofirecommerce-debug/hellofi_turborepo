// components/product-listing/GradeExplainerSection.tsx

interface GradeItem {
  letter: string;
  color: string;
  bgColor: string;
  title: string;
  description: string;
}

const GRADES: GradeItem[] = [
  {
    letter: "L",
    color: "#16A34A",
    bgColor: "#DCFCE7",
    title: "Like New",
    description:
      "Pristine condition, no visible scratches or dents. Works perfectly.",
  },
  {
    letter: "E",
    color: "#2563EB",
    bgColor: "#DBEAFE",
    title: "Excellent",
    description:
      "Minor signs of usage, negligible scratches. Fully functional.",
  },
  {
    letter: "G",
    color: "#0891B2",
    bgColor: "#CFFAFE",
    title: "Good",
    description:
      "Visible wear and tear, moderate scratches. Performance is solid.",
  },
  {
    letter: "F",
    color: "#4B5563",
    bgColor: "#F3F4F6",
    title: "Fair",
    description: "Heavy usage marks, clear scratches. Budget-friendly utility.",
  },
];

export function GradeExplainerSection() {
  return (
    <div className="bg-white border border-card-border rounded-xl p-4 sm:p-6">
      <h2 className="text-sm sm:text-base font-bold text-black mb-2">
        Understanding Preowned Mobile Grades
      </h2>
      <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-5 sm:mb-6">
        Every preowned smartphone listed on this page is categorized based on
        cosmetic and functional condition. Devices may be classified as Like
        New, Excellent, Good, or Fair depending on body condition, display
        quality, battery health, and overall performance. This grading system
        helps buyers compare devices transparently before making a purchase.
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {GRADES.map((grade) => (
          <div
            key={grade.title}
            className="border border-gray-100 rounded-xl p-3 sm:p-4 flex flex-col gap-2"
          >
            <div
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold shrink-0"
              style={{ backgroundColor: grade.bgColor, color: grade.color }}
            >
              {grade.letter}
            </div>
            <p className="text-xs sm:text-sm font-bold text-black">
              {grade.title}
            </p>
            <p className="text-[10px] sm:text-xs text-gray-500 leading-relaxed">
              {grade.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
