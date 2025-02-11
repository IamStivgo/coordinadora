import { Router } from "express";
import { OrdersController } from "../controllers/orders.controller";
import { Types } from "../../di/types";
import { container } from "../../di/container";
import { verifyToken } from "../middlewares/verifyToken";
import { verifyAdmin } from "../middlewares/verifyRole";

const controller : OrdersController = container.get<OrdersController>(Types.OrdersController);

const router = Router();

router.post('/', verifyToken, controller.create);
router.get('/:orderNumber', verifyToken, controller.findByNumber);
router.get('/:orderNumber/status', verifyToken, controller.findStatusByNumber);
router.post('/assign', verifyToken, verifyAdmin ,controller.assignOrder);
router.post('/finish', verifyToken, verifyAdmin ,controller.finishOrder);

export default router;
