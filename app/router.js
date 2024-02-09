import { Router } from "express";
import productRouters from "./routers/product-route.js";
import searchRouters from "./routers/search-route.js";
const router = Router();

router.use("/api", productRouters);
router.use("/api", searchRouters);

export default router;
