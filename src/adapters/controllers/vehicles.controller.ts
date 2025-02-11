import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { Types } from "../../di/types";
import { IVehicleRepository } from "../../domain/repositories/vehicle.repository";

@injectable()
export class VehiclesController {
	constructor(
		@inject(Types.IVehicleRepository) private vehicleRepository: IVehicleRepository
	) { }

    create = async (req: Request, res: Response) => {
        try {
            const vehicle = req.body;
            const newVehicle = await this.vehicleRepository.create(vehicle);
            if (!newVehicle) {
                return res.status(400).send({
                    success: false,
                    message: "Error creating vehicle",
                });
            }

            return res.status(201).send({
                success: true,
                message: "Vehicle created successfully",
                data: newVehicle,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).send({
                message: "Internal server error",
            });
        }
    }

    findById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const vehicle = await this.vehicleRepository.findById(id);
            if (!vehicle) {
                return res.status(404).send({
                    success: false,
                    message: "Vehicle not found",
                });
            }

            return res.status(200).send({
                success: true,
                message: "Vehicle found",
                data: vehicle,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).send({
                message: "Internal server error",
            });
        }
    }
}
