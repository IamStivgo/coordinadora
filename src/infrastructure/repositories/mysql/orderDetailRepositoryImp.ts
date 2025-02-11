import { inject, injectable } from "inversify";
import { v4 } from "uuid";
import { Types } from "../../../di/types";
import { OrderDetailsEntity, CreateOrderDetailsDTO } from "../../../domain/entities/orderDetails.entity";
import { IOrderDetailRepository } from "../../../domain/repositories/orderDetail.repository";
import { IDatabase } from "../../database/dbSource";

@injectable()
export class OrderDetailRepositoryImp implements IOrderDetailRepository {
    constructor(
        @inject(Types.IDatabase) 
        private db: IDatabase
    ){}

    async create(orderDetail: CreateOrderDetailsDTO): Promise<OrderDetailsEntity | null> {
        const { orderId, status } = orderDetail;
        const id = v4();
        const sql = `INSERT INTO order_details (id, order_id, status) VALUES (?, ?, ?)`;
        const params = [id, orderId, status];
        await this.db.executeQuery(sql, params);
        const orderDetailResponse = this.findById(id);
        return orderDetailResponse; 
    }

    async update(orderDetail: OrderDetailsEntity): Promise<OrderDetailsEntity> {
        const { id, orderId, status, createdAt, updatedAt } = orderDetail;
        const sql = `UPDATE order_details SET order_id = ?, status = ?, created_at = ?, updated_at = ? WHERE id = ?`;
        const params = [orderId, status, createdAt, updatedAt, id];
        await this.db.executeQuery<OrderDetailsEntity>(sql, params);
        return orderDetail;
    }

    async delete(id: string): Promise<boolean> {
        const sql = `DELETE FROM order_details WHERE id = ?`;
        const params = [id];
        await this.db.executeQuery(sql, params);
        return true;
    }

    async findById(id: string): Promise<OrderDetailsEntity | null> {
        const sql = `SELECT id, order_id as orderId, status, created_at as createdAt, updated_at as updatedAt FROM order_details WHERE id = ?`;
        const params = [id];
        const result = await this.db.executeQuery<OrderDetailsEntity[]>(sql, params);
        return result.length > 0 ? result[0] : null;
        
    }

    async findByOrderId(orderId: string): Promise<OrderDetailsEntity[]> {
        const sql = `SELECT id, order_id as orderId, status, created_at as createdAt, updated_at as updatedAt FROM order_details WHERE order_id = ?`;
        const params = [orderId];
        const result = await this.db.executeQuery<OrderDetailsEntity[]>(sql, params);
        return result;
    }
}
