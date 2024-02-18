import { Router } from "express";
import prisma from "../utils/prisma.js";
import { Permission } from "../utils/authorization.js";
import { authToken, authorizePermission } from "../middlewares/middlewares.js";
const router = Router();

// Mock payment processing function
async function processPayment(paymentDetails) {
  // Simulate payment processing delay
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return { status: "success" };
}

router.post(
  "/payment",
  authToken,
  authorizePermission(Permission.ADD_PAYMENT),
  async (req, res, next) => {
    try {
      const paymentDetails = req.body;
      const paymentResult = await processPayment(paymentDetails);

      if (paymentResult.status === "success") {
        const updatedOrder = await prisma.order.update({
          where: {
            id: paymentDetails.order_id,
            user_id: req.user.id,
          },
          data: { status: "Processed" },
        });
        res.status(200).json({ message: "Payment processed successfully" });
      } else {
        res.status(400).json({ message: "Payment failed" });
      }
    } catch (error) {
      next(error);
    }
  }
);

export default router;
