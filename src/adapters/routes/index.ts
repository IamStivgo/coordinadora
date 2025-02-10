import { Router } from "express";

import usersRouter from "./users.router";

const router = Router();
router.use("/v1/users", usersRouter);

export default router;

