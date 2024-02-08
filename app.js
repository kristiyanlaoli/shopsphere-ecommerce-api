import express from "express";
import productRouters from "./app/routers/product-route.js";
const app = express();

app.use(express.json());
app.use(productRouters);

app.get("/", (req, res) => {
  res.json({ message: "Hello, welcome to ecommerce-api" });
});

export default app;
