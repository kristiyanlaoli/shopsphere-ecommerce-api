import express from "express";
import productRoute from "./app/routers/product-route.js";
const app = express();

app.use(express.json());
app.use(productRoute);

app.get("/", (req, res) => {
  res.json({ message: "Hello, welcome to ecommerce-api" });
});

export default app;
