import { Router } from "express";
import productRouters from "./routers/product-route.js";
import searchRouters from "./routers/search-route.js";
import cartRouters from "./routers/cart-route.js";
import orderRouters from "./routers/order-route.js";
import loginRouters from "./routers/login.js";
import sigupRouters from "./routers/signup.js";
import paymentRouters from "./routers/payment-route.js";
import profileRouters from "./routers/profile-route.js";
import categoryRouters from "./routers/category-route.js";
const router = Router();

router.use("/api", productRouters);
router.use("/api", searchRouters);
router.use("/api", cartRouters);
router.use("/api", orderRouters);
router.use("/api", loginRouters);
router.use("/api", sigupRouters);
router.use("/api", paymentRouters);
router.use("/api", profileRouters);
router.use("/api", categoryRouters);

export default router;
