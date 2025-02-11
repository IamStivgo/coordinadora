import { inject, injectable } from "inversify";
import { v4 } from "uuid";
import { Types } from "../../../di/types";
import { RouteEntity, CreateRouteDTO } from "../../../domain/entities/route.entity";
import { IRouteRepository } from "../../../domain/repositories/route.repository";
import { IDatabase } from "../../database/dbSource";

@injectable()
export class RouteRepositoryImp implements IRouteRepository{
    constructor(
        @inject(Types.IDatabase) 
        private db: IDatabase
    ){}

    async create(route: CreateRouteDTO): Promise<RouteEntity | null> {
        const { name, origin, destination, distance, departureTime, departureDate } = route;
        const id = v4();
        const departureDateSQL = new Date(departureDate).toISOString().split('T')[0];
        const sql = `INSERT INTO routes (id, name, origin, destination, distance, departure_time, departure_date) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const params = [id, name, origin, destination, distance, departureTime, departureDateSQL];
        await this.db.executeQuery(sql, params);
        const routeResponse = this.findById(id);
        return routeResponse; 
    }

    async update(route: RouteEntity): Promise<RouteEntity> {
        const { id, name, origin, destination, distance, departureTime, departureDate, arrivalTime, arrivalDate, driverId, vehicleId, createdAt, updatedAt } = route;
        const departureDateSQL = new Date(departureDate).toISOString().split('T')[0];
        const arrivalDateSQL = arrivalDate ? new Date(arrivalDate).toISOString().split('T')[0] : null;
        const sql = `UPDATE routes SET name = ?, origin = ?, destination = ?, distance = ?, departure_time = ?, departure_date = ?, arrival_time = ?, arrival_date = ?, driver_id = ?, vehicle_id = ?, created_at = ?, updated_at = ? WHERE id = ?`;
        const params = [name, origin, destination, distance, departureTime, departureDateSQL, arrivalTime, arrivalDateSQL, driverId, vehicleId, createdAt, updatedAt, id];
        await this.db.executeQuery<RouteEntity>(sql, params);
        return route;
    }

    async delete(id: string): Promise<boolean> {
        const sql = `DELETE FROM routes WHERE id = ?`;
        const params = [id];
        await this.db.executeQuery(sql, params);
        return true;
    }

    async findById(id: string): Promise<RouteEntity | null> {
        const sql = `SELECT id, name, origin, destination, distance, departure_time as departureTime, departure_date as departureDate, arrival_time as arrivalTime, arrival_date as arrivalDate, driver_id as driverId, vehicle_id as vehicleId, created_at as createdAt, updated_at as updatedAt FROM routes WHERE id = ?`;
        const params = [id];
        const result = await this.db.executeQuery<RouteEntity[]>(sql, params);
        return result.length > 0 ? result[0] : null;
    }

    async findByOriginAndDestination(origin: string, destination: string): Promise<RouteEntity[] | null> {
        const sql = `SELECT id, name, origin, destination, distance, departure_time as departureTime, departure_date as departureDate, 
            arrival_time as arrivalTime, arrival_date as arrivalDate, driver_id as driverId, vehicle_id as vehicleId, created_at as createdAt, 
            updated_at as updatedAt FROM routes WHERE origin = ? AND destination = ?`;
        const params = [origin, destination];
        const result = await this.db.executeQuery<RouteEntity[]>(sql, params);
        return result.length > 0 ? result : null;
    }
}