const GENDER_WORDS = {
  men: "men", mens: "men", "men's": "men",
  women: "women", womens: "women", "women's": "women",
  kid: "kids", kids: "kids", "kids'": "kids",
};

const haystack = (p) =>
  [p.title, p.colorway, p.category, p.description].filter(Boolean).join(" ").toLowerCase();

// Every word in the query must match: gender words match the product's gender,
// other words must appear in its title, colourway, category or description.
export const matchesQuery = (product, query) => {
  const words = String(query).toLowerCase().split(/\s+/).filter(Boolean);
  const text = haystack(product);
  return words.every((w) => {
    const gender = GENDER_WORDS[w];
    if (gender) return product.gender === gender || (gender !== "kids" && product.gender === "unisex");
    return text.includes(w);
  });
};
