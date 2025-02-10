import { inject, injectable } from "inversify";
import { v4 } from "uuid";
import { Types } from "../../../di/types";
import { PackageEntity, CreatePackageDTO } from "../../../domain/entities/package.entity";
import { IPackageRepository } from "../../../domain/repositories/package.repository";
import { IDatabase } from "../../database/dbSource";

@injectable()
export class PackageRepositoryImp implements IPackageRepository {
    constructor(
        @inject(Types.IDatabase) 
        private db: IDatabase
    ){}


    async create(pack: CreatePackageDTO): Promise<PackageEntity | null> {
        const { orderId, weight, width, height, depth, kind } = pack;
        const id = v4();
        const sql = `INSERT INTO packages (id, order_id, weight, width, height, depth, kind) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const params = [id, orderId, weight, width, height, depth, kind];
        await this.db.executeQuery(sql, params);
        const packResponse = this.findById(id);
        return packResponse; 
    }

    async update(pack: PackageEntity): Promise<PackageEntity> {
        const { id, orderId, weight, width, height, depth, kind, createdAt, updatedAt } = pack;
        const sql = `UPDATE packages SET order_id = ?, weight = ?, width = ?, height = ?, depth = ?, created_at = ?, updated_at = ?, kind = ? WHERE id = ?`;
        const params = [orderId, weight, width, height, depth, createdAt, updatedAt, kind, id];
        await this.db.executeQuery<PackageEntity>(sql, params);
        return pack;
    }

    async delete(id: string): Promise<boolean> {
        const sql = `DELETE FROM packages WHERE id = ?`;
        const params = [id];
        await this.db.executeQuery(sql, params);
        return true;
    }

    async findById(id: string): Promise<PackageEntity | null> {
        const sql = `SELECT id, order_id as orderId, weight, width, height, depth, kind, created_at as createdAt, updated_at as updatedAt FROM packages WHERE id = ?`;
        const params = [id];
        const result = await this.db.executeQuery<PackageEntity[]>(sql, params);
        return result.length > 0 ? result[0] : null;
        
    }

    async findByOrderId(orderId: string): Promise<PackageEntity[]> {
        const sql = `SELECT id, order_id as orderId, weight, width, height, depth, kind, created_at as createdAt, updated_at as updatedAt FROM packages WHERE order_id = ?`;
        const params = [orderId];
        const result = await this.db.executeQuery<PackageEntity[]>(sql, params);
        return result;
    }



    
}