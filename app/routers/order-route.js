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
    try {
      const cart = await prisma.cart.findMany({
        where: {
          user_id: req.user.id,
        },
      });

      const total = cart.reduce((sum, item) => sum + item.total, 0);

      // Save the order details to the 'orders' table
      const order = await prisma.order.create({
        data: {
          total,
          user_id: req.user.id,
          created_at: new Date(), // Set the current timestamp
          items: {
            createMany: {
              data: cart.map((item) => ({
                product_id: item.productID,
                quantity: item.quantity,
                total: item.total,
              })),
            },
          },
        },
      });

      // Clear the cart after the order is placed
      await prisma.cart.deleteMany({
        where: {
          user_id: req.user.id,
        },
      });

      res.json({ message: "Order placed successfully", order });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

export default router;
