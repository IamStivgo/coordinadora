import { Router } from "express";

import usersRouter from "./users.router";
import ordersRouter from "./orders.router";

const router = Router();
router.use("/v1/users", usersRouter);
router.use("/v1/orders", ordersRouter);

export default router;

