import { Router } from "express";
import { UsersController } from "../controllers/users.controller";
import { Types } from "../../di/types";
import { container } from "../../di/container";
import { verifyToken } from "../middlewares/verifyToken";
import { verifyAdmin } from "../middlewares/verifyRole";

const controller : UsersController = container.get<UsersController>(Types.UsersController);

const router = Router();

router.post('/', verifyToken, verifyAdmin ,controller.createDriver);
router.get('/:id', verifyToken, verifyAdmin ,controller.getDriverById);
router.put('/:id', verifyToken, verifyAdmin ,controller.updateDriver);

export default router;