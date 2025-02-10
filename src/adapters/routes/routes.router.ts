import { Router } from "express";
import { Types } from "../../di/types";
import { container } from "../../di/container";
import { verifyToken } from "../middlewares/verifyToken";
import { verifyAdmin } from "../middlewares/verifyRole";
import { RoutesController } from "../controllers/routes.controller";

const controller : RoutesController = container.get<RoutesController>(Types.RoutesController);

const router = Router();

router.post('/', verifyToken, verifyAdmin ,controller.create);
export default router;
