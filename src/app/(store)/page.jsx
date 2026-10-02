import Hero from "@/components/home/Hero";
import CategoryTiles from "@/components/home/CategoryTiles";
import Spotlight from "@/components/home/Spotlight";
import AudienceCards from "@/components/home/AudienceCards";
import SectionHeading from "@/components/ui/SectionHeading";
import ProductRail from "@/components/product/ProductRail";
import ProductGrid from "@/components/product/ProductGrid";
import RecentlyViewed from "@/components/product/RecentlyViewed";
import { getProducts } from "@/lib/server/products";
import { CATEGORIES } from "@/config/store";

export const revalidate = 60;

const firstImage = (list) => list.find((p) => p.image)?.image ?? "";

export default async function Home() {
  const products = await getProducts();
  const featured = products.filter((p) => p.featured);
  const trending = (featured.length >= 4 ? featured : products).slice(0, 10);
  const onSale = products.filter((p) => p.compareAtPrice > p.price);
  const byGender = (g) => products.filter((p) => p.gender === g || (g !== "kids" && p.gender === "unisex"));

  const tiles = [
    ...CATEGORIES.map((c) => {
      const list = products.filter((p) => p.category === c.slug);
      return { label: c.label, href: `/shop?category=${c.slug}`, count: list.length, image: firstImage(list) };
    }),
    { label: "Kids", href: "/shop?gender=kids", count: byGender("kids").length, image: firstImage(byGender("kids")) },
    { label: "Sale", href: "/shop?sale=1", count: onSale.length, image: firstImage(onSale) },
  ].filter((t) => t.count > 0);

  // Spotlight the product family with the most colourways.
  const families = products.reduce((acc, p) => ((acc[p.title] = (acc[p.title] ?? 0) + 1), acc), {});
  const spotlightTitle = Object.entries(families).sort((a, b) => b[1] - a[1])[0]?.[0];
  const spotlight =
    products.find((p) => p.title === spotlightTitle && p.images.length > 2) ??
    products.find((p) => p.title === spotlightTitle);

  const audiences = [
    { label: "Men", href: "/shop?gender=men", list: byGender("men") },
    { label: "Women", href: "/shop?gender=women", list: byGender("women") },
    { label: "Kids", href: "/shop?gender=kids", list: byGender("kids") },
  ]
    .filter((a) => a.list.length)
    .map((a) => ({ label: a.label, href: a.href, count: a.list.length, image: (a.list.find((p) => p.featured) ?? a.list[0]).image }));

  return (
    <>
      <Hero spotlight={trending[0]} styleCount={products.length} />

      {tiles.length > 0 && (
        <section className="container mt-14" aria-labelledby="categories-heading">
          <SectionHeading title={<span id="categories-heading">Shop by category</span>} href="/shop" linkLabel="Browse all" />
          <CategoryTiles tiles={tiles} />
        </section>
      )}

      {trending.length > 0 && (
        <section className="container mt-20" aria-labelledby="trending-heading">
          <SectionHeading
            eyebrow="Trending"
            title={<span id="trending-heading">Popular right now</span>}
            description="The pairs everyone’s reaching for this season."
            href="/shop"
          />
          <ProductRail products={trending} label="Popular right now" />
        </section>
      )}

      {spotlight && <Spotlight product={spotlight} familyCount={families[spotlight.title]} />}

      {audiences.length > 0 && (
        <section className="container mt-20" aria-labelledby="audience-heading">
          <SectionHeading title={<span id="audience-heading">Shop for</span>} />
          <AudienceCards cards={audiences} />
        </section>
      )}

      <section className="container mt-20" aria-labelledby="new-heading">
        <SectionHeading
          eyebrow="Just dropped"
          title={<span id="new-heading">New arrivals</span>}
          href="/shop?sort=newest"
        />
        <ProductGrid products={products.slice(0, 8)} />
      </section>

      {onSale.length > 0 && (
        <section className="container mt-20" aria-labelledby="sale-heading">
          <SectionHeading
            eyebrow="Limited time"
            title={<span id="sale-heading">On sale</span>}
            description="Reduced prices on selected colourways while sizes last."
            href="/shop?sale=1"
          />
          <ProductRail products={onSale} label="On sale" />
        </section>
      )}

      <RecentlyViewed />
    </>
  );
}
