import prisma from "./prisma.js";

async function connectProductToCategories(product, category_id) {
  const categoriesArray = Array.isArray(category_id)
    ? category_id
    : [category_id];
  for (let i = 0; i < categoriesArray.length; i++) {
    const categoryProduct = await prisma.categoryProduct.create({
      data: {
        product_id: product.id,
        category_id: categoriesArray[i],
      },
    });
  }
}

export default connectProductToCategories;
