import { Router } from "express";
import productRouters from "./routers/product-route.js";
import searchRouters from "./routers/search-route.js";
import cartRouters from "./routers/cart-route.js";
import orderRouters from "./routers/order-route.js";
const router = Router();

router.use("/api", productRouters);
router.use("/api", searchRouters);
router.use("/api", cartRouters);
router.use("/api", orderRouters);

export default router;
