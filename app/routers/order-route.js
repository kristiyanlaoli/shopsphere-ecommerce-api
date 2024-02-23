import { Router } from "express";
import prisma from "../utils/prisma.js";
import { Permission } from "../utils/authorization.js";
import { authToken, authorizePermission } from "../middlewares/middlewares.js";
const router = Router();

// Add to Order (Checkout)
router.post(
  "/order",
  authToken,
  authorizePermission(Permission.ADD_ORDER),
  async (req, res) => {
    const { cart_id } = req.body;
    if (!cart_id) {
      return res.status(400).json({ message: "Cart id is required" });
    }
    try {
      const cart = await prisma.cart.findMany({
        where: {
          id: { in: cart_id },
          user_id: req.user.id,
        },
      });

      const total = cart.reduce((sum, item) => sum + item.total, 0);

      if (total === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }

      // Save the order details to the 'orders' table
      const order = await prisma.order.create({
        data: {
          total,
          user_id: req.user.id,
          created_at: new Date(), // Set the current timestamp
          items: {
            createMany: {
              data: cart.map((item) => ({
                product_id: item.product_id,
                quantity: item.quantity,
                total: item.total,
              })),
            },
          },
        },
      });

      // Subtract the product quantity from the inventory
      for (let i = 0; i < cart.length; i++) {
        const item = cart[i];
        await prisma.product.update({
          where: {
            id: item.product_id,
          },
          data: {
            inventory: {
              decrement: item.quantity,
            },
          },
        });
      }
      // Clear the cart after the order is placed
      await prisma.cart.deleteMany({
        where: {
          id: { in: cart_id },
          user_id: req.user.id,
        },
      });

      res.status(200).json({ message: "Order placed successfully", order });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Show Order
router.get(
  "/order",
  authToken,
  authorizePermission(Permission.ADD_ORDER),
  async (req, res) => {
    try {
      const orders = await prisma.order.findMany({
        where: { user_id: req.user.id },
        include: { items: true },
      });

      if (orders.length === 0) {
        return res.status(404).json({ message: "No order found" });
      }

      //get product details
      for (let i = 0; i < orders.length; i++) {
        const items = orders[i].items;
        for (let j = 0; j < items.length; j++) {
          const product = await prisma.product.findUnique({
            where: { id: items[j].product_id },
          });
          items[j].product = product;
        }
      }

      res.status(200).json({ orders });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

export default router;
