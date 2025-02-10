import { Router } from "express";

import usersRouter from "./users.router";
import ordersRouter from "./orders.router";
import driversRouter from "./drivers.router";

const router = Router();
router.use("/v1/users", usersRouter);
router.use("/v1/orders", ordersRouter);
router.use("/v1/drivers", driversRouter);

export default router;

