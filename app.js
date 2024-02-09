import express from "express";
import router from "./app/router.js";

const app = express();

app.use(express.json());
app.use(router);

app.get("/", (req, res) => {
  res.json({ message: "Hello, welcome to ecommerce-api" });
});

export default app;
