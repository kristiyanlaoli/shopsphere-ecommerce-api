import { Router } from "express";
import productRouters from "./routers/product-route.js";

const router = Router();

router.use("/api", productRouters);

export default router;
