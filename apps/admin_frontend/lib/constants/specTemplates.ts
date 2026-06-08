export const SPEC_TEMPLATES: Record<
  string,
  { key: string; value: string; group: string; sortOrder: number }[]
> = {
  "smart-watch": [
    { key: "Brand", value: "", group: "General", sortOrder: 0 },
    { key: "Connectivity", value: "", group: "General", sortOrder: 1 },
    { key: "Series", value: "", group: "General", sortOrder: 2 },
    { key: "Display Size", value: "", group: "Display", sortOrder: 3 },
  ],
  tablet: [
    { key: "Brand", value: "", group: "General", sortOrder: 0 },
    { key: "Connectivity", value: "", group: "General", sortOrder: 1 },
    { key: "Screen Size", value: "", group: "General", sortOrder: 2 },
    { key: "Front Camera", value: "", group: "Camera", sortOrder: 3 },
    { key: "Rear Camera", value: "", group: "Camera", sortOrder: 4 },
    { key: "Memory", value: "", group: "Memory and Storage", sortOrder: 5 },
    { key: "Storage", value: "", group: "Memory and Storage", sortOrder: 6 },
    { key: "Processor", value: "", group: "Performance", sortOrder: 7 },
    { key: "Capacity", value: "", group: "Battery", sortOrder: 8 },
  ],
  laptop: [
    { key: "Brand", value: "", group: "General", sortOrder: 0 },
    { key: "Series", value: "", group: "General", sortOrder: 1 },
    { key: "Operating System", value: "", group: "General", sortOrder: 2 },
    { key: "Processor Name", value: "", group: "Processor", sortOrder: 3 },
    { key: "Processor Speed", value: "", group: "Processor", sortOrder: 4 },
    { key: "Graphics", value: "", group: "Processor", sortOrder: 5 },
    { key: "Memory", value: "", group: "Memory and Storage", sortOrder: 6 },
    { key: "Storage", value: "", group: "Memory and Storage", sortOrder: 7 },
    { key: "Screen Size", value: "", group: "Display", sortOrder: 8 },
    { key: "Ideal For", value: "", group: "Ideal for", sortOrder: 9 },
  ],
  "mobile-phone": [
    { key: "Brand", value: "", group: "General", sortOrder: 0 },
    { key: "Connectivity", value: "", group: "General", sortOrder: 1 },
    { key: "Screen Size", value: "", group: "General", sortOrder: 2 },
    { key: "Market Price", value: "", group: "General", sortOrder: 3 },
    { key: "Front Camera", value: "", group: "Camera", sortOrder: 4 },
    { key: "Rear Camera", value: "", group: "Camera", sortOrder: 5 },
    { key: "Memory", value: "", group: "Memory and Storage", sortOrder: 6 },
    { key: "Storage", value: "", group: "Memory and Storage", sortOrder: 7 },
    { key: "Chipset", value: "", group: "Performance", sortOrder: 8 },
    { key: "Capacity", value: "", group: "Battery", sortOrder: 9 },
  ],
};

export const CATEGORY_LABELS: Record<string, string> = {
  "smart-watch": "Smart Watch",
  tablet: "Tablet",
  laptop: "Laptop",
  "mobile-phone": "Mobile Phone",
};

export type SpecTemplate = (typeof SPEC_TEMPLATES)[string];
