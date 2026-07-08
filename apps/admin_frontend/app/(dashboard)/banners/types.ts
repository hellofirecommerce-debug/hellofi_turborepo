export interface BuyCategoryBanner {
  id: string;
  alt: string;
  lg: string;
  sm: string;
  redirectUrl: string | null;
  placement: string;
  priority: number;
  isActive: boolean;
  createdAt: string;
}

export const sampleBanners: BuyCategoryBanner[] = [
  {
    id: "1",
    alt: "Best Selling Mobiles",
    lg: "",
    sm: "",
    redirectUrl: "/buy-used-mobile-phones",
    placement: "BUY_MOBILE",
    priority: 1,
    isActive: true,
    createdAt: "2024-01-10",
  },
  {
    id: "2",
    alt: "Best Selling Laptops",
    lg: "",
    sm: "",
    redirectUrl: "/buy-used-laptops",
    placement: "BUY_LAPTOP",
    priority: 2,
    isActive: true,
    createdAt: "2024-01-15",
  },
  {
    id: "3",
    alt: "Best Selling Tablets",
    lg: "",
    sm: "",
    redirectUrl: "/buy-used-tablets",
    placement: "BUY_TABLET",
    priority: 3,
    isActive: false,
    createdAt: "2024-02-01",
  },
];
