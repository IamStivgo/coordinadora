import { Router } from "express";
import { UsersController } from "../controllers/users.controller";
import { Types } from "../../di/types";
import { container } from "../../di/container";

const controller : UsersController = container.get<UsersController>(Types.UsersController);

const router = Router();

router.post('/sign-up', controller.signUp);
router.post('/sign-in', controller.signIn);

export default router;
