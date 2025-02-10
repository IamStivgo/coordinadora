import { inject, injectable } from "inversify";
import { v4 } from "uuid";
import { Types } from "../../../di/types";
import { vehicleEntity, CreateVehicleDTO } from "../../../domain/entities/vehicle.entity";
import { IVehicleRepository } from "../../../domain/repositories/vehicle.repository";
import { IDatabase } from "../../database/dbSource";

@injectable()
export class VehicleRepositoryImp implements IVehicleRepository{
    constructor(
        @inject(Types.IDatabase) 
        private db: IDatabase
    ){}

    async create(vehicle: CreateVehicleDTO): Promise<vehicleEntity | null> {
        const { brand, model, licensePlate, capacity, currentLocation, maxWeight } = vehicle;
        const id = v4();
        const sql = `INSERT INTO vehicles (id, brand, model, license_plate, capacity, current_location, max_weight) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const params = [id, brand, model, licensePlate, capacity, currentLocation, maxWeight];
        await this.db.executeQuery(sql, params);
        const vehicleResponse = this.findById(id);
        return vehicleResponse; 
    }

    async update(vehicle: vehicleEntity): Promise<vehicleEntity> {
        const { id, brand, model, licensePlate, capacity, currentLocation, maxWeight, createdAt, updatedAt } = vehicle;
        const sql = `UPDATE vehicles SET brand = ?, model = ?, license_plate = ?, capacity = ?, current_location = ?, max_weight = ?, created_at = ?, updated_at = ? WHERE id = ?`;
        const params = [brand, model, licensePlate, capacity, currentLocation, maxWeight, createdAt, updatedAt, id];
        await this.db.executeQuery<vehicleEntity>(sql, params);
        return vehicle;
    }

    async delete(id: string): Promise<boolean> {
        const sql = `DELETE FROM vehicles WHERE id = ?`;
        const params = [id];
        await this.db.executeQuery(sql, params);
        return true;
    }

    async findById(id: string): Promise<vehicleEntity | null> {
        const sql = `SELECT id, brand, model, license_plate as licensePlate, capacity, current_location as currentLocation, max_weight as maxWeight, created_at as createdAt, updated_at as updatedAt FROM vehicles WHERE id = ?`;
        const params = [id];
        const result = await this.db.executeQuery<vehicleEntity[]>(sql, params);
        return result.length > 0 ? result[0] : null;
        
    }

    async findByBrand(brand: string): Promise<vehicleEntity[]> {
        const sql = `SELECT id, brand, model, license_plate as licensePlate, capacity, current_location as currentLocation, max_weight as maxWeight, created_at as createdAt, updated_at as updatedAt FROM vehicles WHERE brand = ?`;
        const params = [brand];
        const result = await this.db.executeQuery<vehicleEntity[]>(sql, params);
        return result;
    }
}
