import { Router } from "express";

import usersRouter from "./users.router";
import ordersRouter from "./orders.router";
import driversRouter from "./drivers.router";
import routesRouter from "./routes.router";
import vehiclesRouter from "./vehicles.router";

const router = Router();
router.use("/v1/users", usersRouter);
router.use("/v1/orders", ordersRouter);
router.use("/v1/drivers", driversRouter);
router.use("/v1/routes", routesRouter);
router.use("/v1/vehicles", vehiclesRouter);

export default router;

