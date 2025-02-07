import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET = "secret";


export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
	const token = req.headers.authorization;

	if (!token) {
		return res.status(401).send({
			message: "No token provided",
		});
	}

	try {
		jwt.verify(token, SECRET, (err, _decoded) => {
			if (err) {
				return res.status(401).send({
					message: "Unauthorized",
				});
			}

			next();
		});
	} catch (err) {
		return res.status(401).send({
			message: "Unauthorized",
		});
	}
};
