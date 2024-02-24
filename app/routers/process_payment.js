import express from "express";
import { Router } from "express";
import prisma from "../utils/prisma.js";
import { Permission } from "../utils/authorization.js";
import { authToken, authorizePermission } from "../middlewares/middlewares.js";
import { config } from "dotenv";
import Stripe from "stripe";

const router = Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2020-08-27",
});

router.post("/process_payment", async (req, res) => {
  const userID = 37;

  const order = await prisma.order.findFirst({
    where: {
      user_id: userID,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  const productData = await prisma.orderItem.findMany({
    where: { order_id: order.id },
  });

  console.log("Order Items:", productData);

  const shippingRate = await stripe.shippingRates.create({
    display_name: "Ground shipping",
    type: "fixed_amount",
    fixed_amount: {
      amount: 500,
      currency: "usd",
    },
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],

    line_items: productData.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: `Product ${item.product_id}`,
        },
        unit_amount: item.total, // Stripe requires amount in cents
      },
      quantity: item.quantity,
    })),

    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 200,
            currency: "usd",
          },
          display_name: "J&T",
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: 1,
            },
            maximum: {
              unit: "business_day",
              value: 1,
            },
          },
        },
      },
    ],
    billing_address_collection: "auto",
    mode: "payment",
    success_url: `http://localhost:5173/payment_success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `http://localhost:5173/payment`,
    metadata: {
      order_id: order.id,
    },
  });

  console.log("Order Items:", productData);

  console.log(session);
  res.send(session);
});

router.get("/afterPayment", async (req, res) => {
  const { session_id } = req.query;

  try {
    // Additional logic here
    console.log("Received session_id:", session_id);

    const session = await stripe.checkout.sessions.retrieve(session_id);

    const paymentStatus = session.payment_status;

    if (paymentStatus === "paid") {
      const updatedOrder = await prisma.order.update({
        where: {
          id: 60,
          user_id: 37, // Replace with the actual orderId
        },
        data: {
          status: "Paid",
        },
      });

      console.log(true, "Paid order", updatedOrder);
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Failed to update order status" });
  }
});

export default router;
