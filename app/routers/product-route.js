import { Router } from "express";
import prisma from "../utils/prisma.js";
import validateProductId from "../middlewares/productMiddleware.js";
import connectProductToCategories from "../utils/categoryProductUtils.js";
import { Permission } from "../utils/authorization.js";
import {
  authToken,
  authorizePermission,
} from "../middlewares/authTokenAndPermission.js";
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
  return res.json(product);
});

// Add new product to data
router.post(
  "/products",
  authToken,
  authorizePermission(Permission.ADD_PRODUCT),
  async (req, res) => {
    const { name, price, description, image, category_id, inventory, rating } =
      req.body;
    const seller_id = req.user.id;

    if (
      !name ||
      !price ||
      !description ||
      !image ||
      !category_id ||
      !inventory
    ) {
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
        seller_id,
      },
    });

    // connect category_id from product to category via categoryProduct_pivot_tabel:
    connectProductToCategories(product, category_id);

    res.json({ message: "Product has been created", product });
  }
);

//update product
router.put(
  "/products/:id",
  validateProductId,
  authToken,
  authorizePermission(Permission.EDIT_PRODUCT),
  async (req, res) => {
    //check if user is authorized to update product
    const { productId } = req;
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    const seller_id = req.user.id;
    if (product.seller_id !== seller_id) {
      return res.status(401).json({ message: "You are not authorized" });
    }
    //update product
    const { name, price, description, image, category_id, inventory, rating } =
      req.body;
    if (
      !name ||
      !price ||
      !description ||
      !image ||
      !category_id ||
      !inventory
    ) {
      return res.status(400).json({ message: "title is required" });
    }

    const updatedproduct = await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        price,
        description,
        image,
        inventory,
        rating,
        seller_id,
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
  }
);

//delete product
router.delete(
  "/products/:id",
  validateProductId,
  authToken,
  authorizePermission(Permission.DELETE_PRODUCT),
  async (req, res) => {
    //Check if user is the seller of the product
    const { productId } = req;
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    const seller_id = req.user.id;
    if (product.seller_id !== seller_id) {
      return res.status(401).json({ message: "You are not authorized" });
    }
    // delete category_id of product from categoryProduct_pivot_tabel
    await prisma.categoryProduct.deleteMany({
      where: { product_id: productId },
    });

    const deletedProduct = await prisma.product.delete({
      where: { id: productId },
    });

    res.json({ message: "Product has been deleted", product: deletedProduct });
  }
);

export default router;
