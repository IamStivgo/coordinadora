import { Router } from "express";
import { OrdersController } from "../controllers/orders.controller";
import { Types } from "../../di/types";
import { container } from "../../di/container";
import { verifyToken } from "../middlewares/verifyToken";

const controller : OrdersController = container.get<OrdersController>(Types.OrdersController);

const router = Router();

router.post('/', verifyToken, controller.create);
router.get('/:numberOrder', verifyToken, controller.findByNumber);
router.get('/:numberOrder/status', verifyToken, controller.findStatusByNumber);

export default router;
