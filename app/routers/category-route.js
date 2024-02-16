import { Router } from "express";
import prisma from "../utils/prisma.js";
import { Permission } from "../utils/authorization.js";
import { authToken, authorizePermission } from "../middlewares/middlewares.js";

const router = Router();

// Administrator can add categories
router.post(
  "/categories",
  authToken,
  authorizePermission(Permission.ADD_CATEGORY),
  async (req, res, next) => {
    try {
      const { category_name } = req.body;
      //check if category_name is empty
      if (!category_name) {
        return res.status(400).json({ message: "Category name is required" });
      }

      //check if category already exists
      const categoryExists = await prisma.category.findFirst({
        where: { name: category_name },
      });
      if (categoryExists) {
        return res.status(400).json({ message: "Category already exists" });
      } else {
        const category = await prisma.category.create({
          data: { name: category_name },
        });
        res.json({ message: "Category added successfully", category });
      }
    } catch (error) {
      next(error);
    }
  }
);

// Administrator can edit categories
router.put(
  "/categories/:id",
  authToken,
  authorizePermission(Permission.EDIT_CATEGORY),
  async (req, res) => {
    const { id } = req.params;
    const { category_name } = req.body;
    //check if id exists
    const categoryExists = await prisma.category.findFirst({
      where: { id: parseInt(id) },
    });
    if (!categoryExists) {
      return res.status(404).json({ message: "Category not found" });
    }
    //check if category_name is empty
    if (!category_name) {
      return res.status(400).json({ message: "Category name is required" });
    }
    const category = await prisma.category.update({
      where: { id: parseInt(id) },
      data: { name: category_name },
    });
    res.json({ message: "Category updated successfully", category });
  }
);

// Administrator can delete categories
router.delete(
  "/categories/:id",
  authToken,
  authorizePermission(Permission.DELETE_CATEGORY),
  async (req, res) => {
    const { id } = req.params;
    //check if id exists
    const categoryExists = await prisma.category.findFirst({
      where: { id: parseInt(id) },
    });
    if (!categoryExists) {
      return res.status(404).json({ message: "Category not found" });
    }
    await prisma.category.delete({ where: { id: parseInt(id) } });
    res.json({ message: "Category deleted successfully" });
  }
);

// Get all categories
router.get("/categories", async (req, res) => {
  const categories = await prisma.category.findMany();
  res.json(categories);
});

// Get products by category
router.get("/categories/:id", async (req, res) => {
  const { id } = req.params;
  const categoryProducts = await prisma.categoryProduct.findMany({
    where: { category_id: parseInt(id) },
    include: { product: true },
  });

  const products = categoryProducts.map((cp) => cp.product);

  res.json(products);
});

export default router;
