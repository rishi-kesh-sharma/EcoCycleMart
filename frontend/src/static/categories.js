const categories_top_10 = require("./most_frequent_categories_top_10.json");

console.log(categories_top_10, "categories");

const normalized_categories_top_n = categories_top_10.map((category) => {
  return category.value.split(">").slice(0, 2).join(",");
});

console.log(normalized_categories_top_n);
export { normalized_categories_top_n };
