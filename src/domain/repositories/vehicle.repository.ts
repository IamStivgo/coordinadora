import { vehicleEntity, CreateVehicleDTO, QueryVehicleDTO } from "../entities/vehicle.entity";

export interface IVehicleRepository {
    create(vehicle: CreateVehicleDTO): Promise<vehicleEntity | null>
    update(vehicle: vehicleEntity): Promise<vehicleEntity>
    delete(id: string): Promise<boolean>
    findById(id: string): Promise<vehicleEntity | null>
    findByNumberPlate(licensePlate: string): Promise<vehicleEntity | null>
    getAvailableVehicle(params: QueryVehicleDTO): Promise<vehicleEntity[]>
}