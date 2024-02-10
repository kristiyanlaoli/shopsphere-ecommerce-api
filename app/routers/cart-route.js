import { Router } from "express";
import prisma from "../utils/prisma.js";
import { Permission } from "../utils/authorization.js";
import {
  authToken,
  authorizePermission,
} from "../middlewares/authTokenAndPermission.js";
const router = Router();

router.post(
  "/cart",
  authToken,
  authorizePermission(Permission.ADD_CART),
  async (req, res) => {
    const { product_id, quantity } = req.body;

    // check if product is already in cart
    const checkItem = await prisma.cart.findFirst({
      where: { productID: product_id },
    });

    // check if product exists
    const checkProduct = await prisma.product.findFirst({
      where: { id: product_id },
    });

    if (checkItem) {
      const cartQuantity = checkItem.quantity + quantity;
      const totalQuantity = checkItem.total + checkProduct.price * quantity;

      const cartItem = await prisma.cart.update({
        where: { id: checkItem.id },
        data: {
          quantity: cartQuantity,
          productID: product_id,
          total: totalQuantity,
        },
      });
      return res.json({ message: "Product added to cart 1", cartItem });
    } else {
      const cartItem = await prisma.cart.create({
        data: {
          quantity: quantity,
          productID: product_id,
          total: checkProduct.price * quantity,
        },
      });
      res.json({ message: "Product added to cart 2", cartItem });
    }
  }
);

// Show Cart
router.get(
  "/cart",
  authToken,
  authorizePermission(Permission.BROWSE_CARTS),
  async (req, res) => {
    try {
      const cart = await prisma.cart.findMany();

      if (!cart) {
        return res.json({ message: "cart is empty" });
      }

      const total = cart.reduce((sum, item) => sum + item.total, 0);

      res.json({ total, cart });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Step 7: Delete all cart
router.delete(
  "/cart",
  authToken,
  authorizePermission(Permission.DELETE_CART),
  async (req, res) => {
    try {
      await prisma.cart.deleteMany({});

      res.json({ message: "Cart emptied" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Step 8: Delete from Cart by id
router.delete(
  "/cart/:cartId",
  authToken,
  authorizePermission(Permission.DELETE_CART),
  async (req, res) => {
    const cartId = parseInt(req.params.cartId);

    try {
      await prisma.cart.delete({
        where: { id: cartId },
      });

      res.json({ message: "Product removed from cart" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

export default router;