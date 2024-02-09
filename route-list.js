import expressListRoutes from "express-list-routes";
import router from "./app/router.js";
import app from "./app.js";
expressListRoutes(app);
expressListRoutes(router);
