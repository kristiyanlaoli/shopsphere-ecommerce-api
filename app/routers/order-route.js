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

// // Show Order with Products Grouped by Seller
router.get(
  "/order",
  authToken,
  authorizePermission(Permission.ADD_ORDER),
  async (req, res) => {
    try {
      const orders = await prisma.order.findMany({
        where: { user_id: req.user.id },
        include: { items: true }, // Include items without product details
      });

      if (orders.length === 0) {
        return res.status(404).json({ message: "No order found" });
      }

      // Fetch product details for each item in orders
      for (let i = 0; i < orders.length; i++) {
        const items = orders[i].items;
        for (let j = 0; j < items.length; j++) {
          const product = await prisma.product.findUnique({
            where: { id: items[j].product_id },
          });
          items[j].product = product;
        }
      }

      // Group products by seller
      const ordersWithProductsGroupedBySeller = orders.map((order) => {
        const groupedProducts = order.items.reduce((acc, item) => {
          const sellerId = item.product.seller_id;
          if (!acc[sellerId]) {
            acc[sellerId] = [];
          }
          acc[sellerId].push(item);
          return acc;
        }, {});

        const productBySeller = Object.keys(groupedProducts).map(
          (sellerId) => ({
            seller_id: parseInt(sellerId),
            items: groupedProducts[sellerId],
          })
        );

        return { ...order, product_by_seller: productBySeller };
      });

      res.status(200).json({ orders: ordersWithProductsGroupedBySeller });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Show Order by seller
router.get(
  "/order/seller/:seller_id",
  authToken,
  authorizePermission(Permission.ADD_ORDER),
  async (req, res) => {
    const { seller_id } = req.params;
    try {
      // Get all products sold by the seller
      const products = await prisma.product.findMany({
        where: { seller_id: parseInt(seller_id) },
      });

      // Get all order items that contain the seller's products
      const orderItems = await prisma.orderItem.findMany({
        where: {
          product_id: {
            in: products.map((product) => product.id),
          },
        },
        include: {
          order: {
            include: {
              user: true, // Include user details
            },
          },
          product: true,
        },
      });

      // Group order items by order
      const orders = orderItems.reduce((acc, item) => {
        const key = item.order_id;
        if (!acc[key]) {
          acc[key] = {
            ...item.order,
            items: [item],
          };
        } else {
          acc[key].items.push(item);
        }
        return acc;
      }, {});

      if (Object.keys(orders).length === 0) {
        return res.status(404).json({ message: "No order found" });
      }

      res.status(200).json({ message: "Successfull show", orders });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Update receipt number for an order item by seller
router.post(
  "/order/seller/:seller_id",
  authToken,
  authorizePermission(Permission.ADD_ORDER),
  async (req, res) => {
    const { seller_id } = req.params;
    const { order_id, receipt } = req.body;
    try {
      // Get all products sold by the seller
      const products = await prisma.product.findMany({
        where: { seller_id: parseInt(seller_id) },
      });

      // Get all order items for the given order that contain the seller's products
      const orderItems = await prisma.orderItem.findMany({
        where: {
          order_id: parseInt(order_id),
          product_id: {
            in: products.map((product) => product.id),
          },
        },
        include: {
          order: true,
          product: true,
        },
      });

      if (orderItems.length === 0) {
        return res
          .status(404)
          .json({ message: "No order items found for this seller." });
      }

      // Update the order items with the receipt number
      const updatedOrderItems = await prisma.orderItem.updateMany({
        where: {
          order_id: parseInt(order_id),
          product_id: {
            in: products.map((product) => product.id),
          },
        },
        data: {
          receipt: receipt,
        },
      });

      res.status(200).json({
        message: "Receipt numbers updated successfully.",
        updatedOrderItems,
      });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

export default router;
