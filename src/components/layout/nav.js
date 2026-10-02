export const NAV_LINKS = [
  { label: "New & Featured", href: "/shop?sort=newest", match: { sort: "newest" } },
  { label: "Men", href: "/shop?gender=men", match: { gender: "men" } },
  { label: "Women", href: "/shop?gender=women", match: { gender: "women" } },
  { label: "Kids", href: "/shop?gender=kids", match: { gender: "kids" } },
  { label: "Lifestyle", href: "/shop?category=Lifestyle", match: { category: "Lifestyle" } },
  { label: "Training", href: "/shop?category=Training", match: { category: "Training" } },
  { label: "Basketball", href: "/shop?category=Basketball", match: { category: "Basketball" } },
  { label: "Golf", href: "/shop?category=Golf", match: { category: "Golf" } },
  { label: "Sale", href: "/shop?sale=1", match: { sale: "1" }, highlight: true },
];

export const POPULAR_SEARCHES = ["Air Force 1", "Free Metcon", "Cortez", "Basketball", "Kids"];
