import { Request, Response, NextFunction } from "express";
import { UserRole } from "../../domain/entities/user.entity";

export const verifyAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== UserRole.ADMIN) {
        return res.status(403).send({
            message: "Require Admin Role!",
        });
    }
    next();
};