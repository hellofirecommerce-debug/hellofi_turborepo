export interface NavChild {
  label: string;
  href: string;
}

export interface NavItem {
  label: string;
  href?: string;
  children?: NavChild[];
}

export const NAV_LINKS: NavItem[] = [
  {
    label: "Sell",
    children: [
      { label: "Sell Old Phone", href: "/sell-old-mobile-phone" },
      { label: "Sell Old Laptop", href: "/sell-old-laptop" },
      { label: "Sell Old MacBook", href: "/sell-old-macbook" },
      { label: "Sell Old Tablet", href: "/sell-old-tablet" },
      { label: "Sell Old Smartwatch", href: "/sell-old-smartwatch" },
    ],
  },
  {
    label: "Buy",
    href: "/buy-used-gadgets",
    children: [
      { label: "Buy Used Phones", href: "/buy-used-mobile-phones" },
      { label: "Buy Used Laptops", href: "/buy-used-laptops" },
      { label: "Buy Used Tablets", href: "/buy-used-tablets" },
      { label: "Buy Used Smart Watches", href: "/buy-used-smartwatches" },
      { label: "Buy Used Accessories", href: "/buy-used-accessories" },
    ],
  },
  { label: "Premium", href: "/premium" },
  { label: "Stories", href: "/stories" },
  {
    label: "More Options",
    children: [
      { label: "About Us", href: "/about" },
      { label: "Support", href: "/support" },
      { label: "Track Order", href: "/track-order" },
      { label: "FAQs", href: "/faqs" },
    ],
  },
];
