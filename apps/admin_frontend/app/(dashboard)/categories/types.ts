export interface Category {
  id: string;
  name: string;
  seoName: string;
  categoryType: string;
  image: string;
  priority: number;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
}

export const sampleCategories: Category[] = [
  {
    id: "1",
    name: "Mobile",
    seoName: "mobile",
    categoryType: "Electronics",
    image: "",
    priority: 1,
    status: "ACTIVE",
    createdAt: "2024-01-10",
  },
  {
    id: "2",
    name: "Laptop",
    seoName: "laptop",
    categoryType: "Electronics",
    image: "",
    priority: 2,
    status: "ACTIVE",
    createdAt: "2024-01-15",
  },
  {
    id: "3",
    name: "Tablet",
    seoName: "tablet",
    categoryType: "Electronics",
    image: "",
    priority: 3,
    status: "INACTIVE",
    createdAt: "2024-02-01",
  },
  {
    id: "4",
    name: "Audio",
    seoName: "audio",
    categoryType: "Accessories",
    image: "",
    priority: 4,
    status: "ACTIVE",
    createdAt: "2024-02-10",
  },
  {
    id: "5",
    name: "Wearables",
    seoName: "wearables",
    categoryType: "Accessories",
    image: "",
    priority: 5,
    status: "ACTIVE",
    createdAt: "2024-03-01",
  },
];
