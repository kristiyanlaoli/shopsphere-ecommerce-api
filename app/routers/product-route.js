import { Router } from "express";
import prisma from "../prisma.js";
import validateProductId from "../middleware.js";
import connectProductToCategories from "../utils/categoryProductUtils.js";
const router = Router();

// Get all product
router.get("/products", async (req, res) => {
  const products = await prisma.product.findMany();
  res.json(products);
});

// Get product by id
router.get("/products/:id", validateProductId, async (req, res) => {
  const { productId } = req;
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });
  product
    ? res.json(product)
    : res.status(404).json({ message: "Product not found" });
});

// Add new product to data
router.post("/products", async (req, res) => {
  const { name, price, description, image, category_id, inventory, rating } =
    req.body;

  if (!name || !price || !description || !image || !category_id || !inventory) {
    return res.status(400).json({ message: "title is required" });
  }

  const product = await prisma.product.create({
    data: {
      name,
      price,
      description,
      image,
      inventory,
      rating,
    },
  });

  // connect category_id from product to category via categoryProduct_pivot_tabel:
  connectProductToCategories(product, category_id);

  res.json({ message: "Product has been created", product });
});

//update product
router.put("/products/:id", validateProductId, async (req, res) => {
  const { name, price, description, image, category_id, inventory, rating } =
    req.body;
  if (!name || !price || !description || !image || !category_id || !inventory) {
    return res.status(400).json({ message: "title is required" });
  }

  const { productId } = req;
  const updatedproduct = await prisma.product.update({
    where: { id: productId },
    data: {
      name,
      price,
      description,
      image,
      inventory,
      rating,
    },
  });

  // connect category_id from product to category via categoryProduct_pivot_tabel:
  //// delete category_id of product from categoryProduct_pivot_tabel
  await prisma.categoryProduct.deleteMany({
    where: { product_id: productId },
  });
  //// add new category_id of product to categoryProduct_pivot_tabel
  connectProductToCategories(updatedproduct, category_id);

  res.json({ message: "product has been updated", product: updatedproduct });
});

//delete product
router.delete("/products/:id", validateProductId, async (req, res) => {
  // delete category_id of product from categoryProduct_pivot_tabel
  const { productId } = req;
  await prisma.categoryProduct.deleteMany({
    where: { product_id: productId },
  });

  const deletedProduct = await prisma.product.delete({
    where: { id: productId },
  });

  res.json({ message: "Product has been deleted", product: deletedProduct });
});

export default router;
