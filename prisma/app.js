import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello, welcome to ecommerce-api" });
});

export default app;
