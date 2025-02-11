declare module "express-serve-static-core" {
	interface Request {
		user?: QueryUserDTO;
	}
}

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../../config";
import { QueryUserDTO } from "../../domain/entities/user.entity";

const SECRET = config.JWT_SECRET;


export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
	const token = req.headers?.authorization?.replace("Bearer ", "");

	if (!token) {
		return res.status(401).send({
			message: "No token provided",
		});
	}

	try {
		jwt.verify(token, SECRET, (err, decoded) => {
			if (err) {
				return res.status(401).send({
					message: "Unauthorized",
				});
			}

			req.user = decoded as QueryUserDTO;
			next();
		});
	} catch (err) {
		return res.status(401).send({
			message: "Unauthorized",
		});
	}
};
