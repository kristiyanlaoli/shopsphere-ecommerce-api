import { Router } from "express";
import prisma from "../utils/prisma.js";
import { Permission } from "../utils/authorization.js";
import {
  authToken,
  authorizePermission,
  checkSellerBuysHisProduct,
} from "../middlewares/middlewares.js";
import validateCartRequest from "../middlewares/cart-middlewares.js";
const router = Router();

//add product to cart
router.post(
  "/cart",
  authToken,
  authorizePermission(Permission.ADD_CART),
  validateCartRequest,
  checkSellerBuysHisProduct,
  async (req, res, next) => {
    try {
      const user_id = req.user.id;
      const product_id = req.product_id;
      const quantity = req.quantity;
      const checkProduct = req.product;

      // check if product is already in cart
      const checkItem = await prisma.cart.findFirst({
        where: {
          product_id,
          user_id,
        },
      });

      if (checkItem) {
        const totalQuantity = checkItem.total + checkProduct.price * quantity;
        const cartQuantity = checkItem.quantity + quantity;

        if (cartQuantity > checkProduct.inventory) {
          return res.status(400).json({
            message: `Only ${checkProduct.inventory} items left in stock`,
          });
        } else if (cartQuantity < 1) {
          await prisma.cart.delete({
            where: {
              id: checkItem.id,
            },
          });
          return res.json({ message: "Product removed from cart" });
        } else {
          const cartItem = await prisma.cart.update({
            where: { id: checkItem.id },
            data: {
              quantity: cartQuantity,
              product_id,
              total: totalQuantity,
              user_id,
            },
          });

          return res.json({
            message: `Product ${quantity < 1 ? "reduced" : "added"} to cart`,
            cartItem,
          });
        }
      } else {
        if (quantity > checkProduct.inventory) {
          return res.status(400).json({
            message: `Only ${checkProduct.inventory} items left in stock`,
          });
        } else if (quantity < 1) {
          return res.status(400).json({
            message: "The reduced product is not in the cart",
          });
        } else {
          const cartItem = await prisma.cart.create({
            data: {
              quantity: quantity,
              product_id,
              total: checkProduct.price * quantity,
              user_id,
            },
          });
          res.json({ message: "Product added to cart", cartItem });
        }
      }
    } catch (error) {
      next(error);
    }
  }
);

// Show Cart
router.get(
  "/cart",
  authToken,
  authorizePermission(Permission.BROWSE_CARTS),
  async (req, res, next) => {
    try {
      const user_id = req.user.id;
      const cart = await prisma.cart.findMany({
        where: { user_id },
      });
      //get product details
      for (let i = 0; i < cart.length; i++) {
        const product = await prisma.product.findUnique({
          where: { id: cart[i].product_id },
        });
        cart[i].product = product;
      }

      const [checkCart] = cart;

      if (!checkCart) {
        return res.status(404).json({ message: "Cart is empty!" });
      }

      const total = cart.reduce((sum, item) => sum + item.total, 0);

      res.json({ total, cart });
    } catch (error) {
      next(error);
    }
  }
);

// Delete all cart
router.delete(
  "/cart",
  authToken,
  authorizePermission(Permission.DELETE_CART),
  async (req, res, next) => {
    try {
      const user_id = req.user.id;
      await prisma.cart.deleteMany({
        where: { user_id: user_id },
      });

      res.json({ message: "Cart emptied" });
    } catch (error) {
      next(error);
    }
  }
);

// Delete from Cart by cart_id
router.delete(
  "/cart/:cartId",
  authToken,
  authorizePermission(Permission.DELETE_CART),
  async (req, res, next) => {
    try {
      const cartId = parseInt(req.params.cartId);
      const user_id = req.user.id;

      // Check if the product exists in the cart
      const cartItem = await prisma.cart.findFirst({
        where: {
          id: cartId,
          user_id: user_id,
        },
      });

      if (!cartItem) {
        return res.status(404).json({ message: "Product not found in cart" });
      }

      await prisma.cart.delete({
        where: {
          id: cartId,
          user_id: user_id,
        },
      });

      res.status(200).json({ message: "Product removed from cart" });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
