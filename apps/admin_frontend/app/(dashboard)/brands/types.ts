export interface Brand {
  id: string;
  name: string;
  seoName: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  brandCategories: {
    id: string;
    categoryId: string;
    priority: number; // ← add
    status: "ACTIVE" | "INACTIVE"; // ← add
    category: {
      id: string;
      name: string;
    };
  }[];
}

export interface CategoryOption {
  id: string;
  name: string;
}
