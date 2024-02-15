import { Router } from "express";
import prisma from "../utils/prisma.js";
const router = Router();

router.get("/search", async (req, res) => {
  const { query, page = 1, limit = 10 } = req.query;

  if (!query) {
    return res.status(400).json({ message: "Query is required" });
  }

  const skip = (page - 1) * limit;

  // Cari ID kategori berdasarkan nama kategori
  const categories = await prisma.category.findMany({
    where: { name: { contains: query } },
    select: { id: true },
  });

  const categoryIds = categories.map((category) => category.id);

  // Cari ID produk berdasarkan ID kategori
  const categoryProducts = await prisma.categoryProduct.findMany({
    where: { category_id: { in: categoryIds } },
    select: { product_id: true },
  });

  const productIds = categoryProducts.map((cp) => cp.product_id);
  // Cari produk berdasarkan nama, deskripsi, dan ID produk
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: query } },
        { description: { contains: query } },
        { id: { in: productIds } },
      ],
    },
    orderBy: { name: "asc" },
    take: Number(limit),
    skip: skip,
  });

  res.json(products);
});
export default router;
