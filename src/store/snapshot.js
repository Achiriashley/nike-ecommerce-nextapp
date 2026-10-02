// The subset of a product kept in the browser (cart, wishlist, recently viewed).
export const toSnapshot = (product) => ({
  slug: product.slug,
  title: product.title,
  colorway: product.colorway ?? "",
  // Uploaded images are stored as data URLs; don't copy large ones into localStorage.
  image: product.image?.startsWith("data:") && product.image.length > 150_000 ? "" : product.image,
  price: product.price,
  compareAtPrice: product.compareAtPrice ?? null,
  gender: product.gender,
  category: product.category,
});
