import { Router } from "express";
import { Types } from "../../di/types";
import { container } from "../../di/container";
import { verifyToken } from "../middlewares/verifyToken";
import { verifyAdmin } from "../middlewares/verifyRole";
import { VehiclesController } from "../controllers/vehicles.controller";

const controller : VehiclesController = container.get<VehiclesController>(Types.VehiclesController);

const router = Router();

router.post('/', verifyToken, verifyAdmin ,controller.create);
export default router;