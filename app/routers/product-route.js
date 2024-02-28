import { Router } from "express";
import prisma from "../utils/prisma.js";
import connectProductToCategories from "../utils/categoryProductUtils.js";
import { Permission } from "../utils/authorization.js";
import validateProduct from "../utils/validateProduct.js";
import {
  authToken,
  authorizePermission,
  checkProductSeller,
  validateProductId,
} from "../middlewares/middlewares.js";

const router = Router();

// Get all product
router.get("/products", async (req, res) => {
  const products = await prisma.product.findMany({
    include: {
      category_id: {
        select: {
          category: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  // Map the products to include category names and remove category_id
  const productsWithCategoryNames = products.map((product) => {
    const productWithCategoryNames = {
      ...product,
      category: product.category_id.map((cp) => cp.category.name),
    };
    delete productWithCategoryNames.category_id;
    return productWithCategoryNames;
  });

  return res.status(200).json(productsWithCategoryNames);
});

// Get product by id
router.get("/products/:id", validateProductId, async (req, res) => {
  const { product_id } = req;
  const product = await prisma.product.findUnique({
    where: { id: Number(product_id) },
    include: {
      category_id: {
        select: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  // Map the product to include category names and category ids
  const productWithCategoryNamesAndIds = {
    ...product,
    category: product.category_id.map((cp) => cp.category.name),
    category_id: product.category_id.map((cp) => cp.category.id),
  };

  return res.status(200).json(productWithCategoryNamesAndIds);
});

// get products by user id
router.get(
  "/myproducts",
  authToken,
  authorizePermission(Permission.BROWSE_PRODUCTS),
  async (req, res) => {
    const seller_id = req.user.id;
    const products = await prisma.product.findMany({
      where: { seller_id },
      include: {
        category_id: {
          select: {
            category: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    // Map the products to include category names and remove category_id
    const productsWithCategoryNames = products.map((product) => {
      const productWithCategoryNames = {
        ...product,
        category: product.category_id.map((cp) => cp.category.name),
      };
      delete productWithCategoryNames.category_id;
      return productWithCategoryNames;
    });

    return res.status(200).json(productsWithCategoryNames);
  }
);

// Add new product to data
router.post(
  "/products",
  authToken,
  authorizePermission(Permission.ADD_PRODUCT),
  async (req, res) => {
    try {
      //validate product
      const { category_id, ...productData } = validateProduct(req.body);
      const product = await prisma.product.create({
        data: {
          ...productData,
          seller_id: req.user.id,
          origin_id: req.user.city_id,
        },
      });

      // connect category_id from product to category via categoryProduct_pivot_tabel:
      await connectProductToCategories(product, category_id);

      return res
        .status(201)
        .json({ message: "Product has been created", product });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
);

// Update product
router.put(
  "/products/:id",
  validateProductId,
  authToken,
  authorizePermission(Permission.EDIT_PRODUCT),
  checkProductSeller,
  async (req, res) => {
    try {
      //validate product
      const { category_id, ...productData } = validateProduct(req.body);

      //update product
      const { product_id } = req;
      const updatedproduct = await prisma.product.update({
        where: { id: product_id },
        data: { ...productData, seller_id: req.user.id },
      });

      // delete last category_id of product from categoryProduct_pivot_tabel
      await prisma.categoryProduct.deleteMany({
        where: { product_id },
      });

      // connect new category_id from product to category via categoryProduct_pivot_tabel:
      await connectProductToCategories(updatedproduct, category_id);

      return res.status(200).json({
        message: "product has been updated",
        product: updatedproduct,
      });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
);

// Delete product
router.delete(
  "/products/:id",
  validateProductId,
  authToken,
  authorizePermission(Permission.DELETE_PRODUCT),
  checkProductSeller,
  async (req, res) => {
    // delete category_id of product from categoryProduct_pivot_tabel
    const { product_id } = req;
    await prisma.categoryProduct.deleteMany({
      where: { product_id },
    });
    const deletedProduct = await prisma.product.delete({
      where: { id: product_id },
    });

    return res
      .status(200)
      .json({ message: "Product has been deleted", product: deletedProduct });
  }
);

export default router;
