import { Router } from "express";
import productRouters from "./routers/product-route.js";
import searchRouters from "./routers/search-route.js";
import cartRouters from "./routers/cart-route.js";
import orderRouters from "./routers/order-route.js";
import loginRouters from "./routers/login.js";
import sigupRouters from "./routers/signup.js";
const router = Router();

router.use("/api", productRouters);
router.use("/api", searchRouters);
router.use("/api", cartRouters);
router.use("/api", orderRouters);
router.use("/api", loginRouters);
router.use("/api", sigupRouters);

export default router;
