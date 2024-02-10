export default function validateProduct(product) {
  const { name, price, description, image, category_id, inventory, rating } =
    product;

  if (!name || !price || !description || !image || !category_id || !inventory) {
    throw new Error("All fields are required");
  }

  return product;
}
