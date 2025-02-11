import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { Types } from "../../di/types";
import { IRouteRepository } from "../../domain/repositories/route.repository";

@injectable()
export class RoutesController {
	constructor(
		@inject(Types.IRouteRepository) private routeRepository: IRouteRepository
	) { }

    create = async (req: Request, res: Response) => {
        try {
            const route = req.body;
            const newRoute = await this.routeRepository.create(route);
            if (!newRoute) {
                return res.status(400).send({
                    success: false,
                    message: "Error creating route",
                });
            }

            return res.status(201).send({
                success: true,
                message: "Route created successfully",
                data: newRoute,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).send({
                message: "Internal server error",
            });
        }
    }
}
