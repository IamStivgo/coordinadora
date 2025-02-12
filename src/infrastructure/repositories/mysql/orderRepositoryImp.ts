import { inject, injectable } from "inversify";
import { v4 } from "uuid";
import { Types } from "../../../di/types";
import { OrderEntity, CreateOrderDTO } from "../../../domain/entities/order.entity";
import { IOrderRepository } from "../../../domain/repositories/order.repository";
import { IDatabase } from "../../database/dbSource";

@injectable()
export class OrderRepositoryImp implements IOrderRepository {
    constructor(
        @inject(Types.IDatabase)
        private db: IDatabase
    ) { }

    async create(order: CreateOrderDTO): Promise<OrderEntity | null> {
        const { userId, originCity, recipientName, recipientCity, recipientPostalCode, recipientPhoneNumber, recipientAddress, totalWeight } = order;
        const id = v4();
        const sql = `INSERT INTO orders (id, user_id, origin_city, recipient_name, recipient_phone_number, recipient_address, recipient_city, recipient_postal_code, total_weight) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const params = [id, userId, originCity,recipientName, recipientPhoneNumber, recipientAddress, recipientCity, recipientPostalCode, totalWeight];
        await this.db.executeQuery(sql, params);
        const orderResponse = this.findById(id);
        return orderResponse;
    }

    async update(order: OrderEntity): Promise<OrderEntity> {
        const { id, userId, recipientName, recipientCity, recipientPostalCode, recipientPhoneNumber, recipientAddress, totalWeight, routeId } = order;
        const sql = `UPDATE orders SET user_id = ?, recipient_name = ?, recipient_phone_number = ?, recipient_address = ?, recipient_city = ?, recipient_postal_code = ?, total_weight = ?, route_id = ? WHERE id = ?`;
        const params = [userId, recipientName, recipientPhoneNumber, recipientAddress, recipientCity, recipientPostalCode, totalWeight, routeId ,id];
        await this.db.executeQuery<OrderEntity>(sql, params);
        return order;
    }

    async delete(id: string): Promise<boolean> {
        const sql = `DELETE FROM orders WHERE id = ?`;
        const params = [id];
        await this.db.executeQuery(sql, params);
        return true;
    }

    async findById(id: string): Promise<OrderEntity | null> {
        const sql = `SELECT id, user_id as userId, recipient_name as recipientName, recipient_phone_number as recipientPhoneNumber,
             recipient_address as recipientAddress, total_weight as totalWeight, created_at as createdAt, number, updated_at as updatedAt 
             FROM orders WHERE id = ?`;
        const params = [id];
        const result = await this.db.executeQuery<OrderEntity[]>(sql, params);
        return result.length > 0 ? result[0] : null;

    }

    async findByNumber(orderNumber: string): Promise<OrderEntity | null> {
        const sql = `SELECT id, user_id as userId, recipient_name as recipientName, recipient_phone_number as recipientPhoneNumber,
         recipient_address as recipientAddress, recipient_city as recipientCity, recipient_postal_code as recipientPostalCode,
         origin_city as originCity, total_weight as totalWeight, created_at as createdAt, updated_at as updatedAt, route_id as routeId FROM orders WHERE number = ?`;
        const params = [orderNumber];
        const result = await this.db.executeQuery<OrderEntity[]>(sql, params);
        return result.length > 0 ? result[0] : null;
    }

    async findByUserId(userId: string): Promise<OrderEntity[]> {
        const sql = `SELECT id, user_id as userId, recipient_name as recipientName, recipient_phone_number as recipientPhoneNumber, 
            recipient_address as recipientAddress, recipient_city as recipientCity, recipient_postal_code as recipientPostalCode,
            total_weight as totalWeight, created_at as createdAt, updated_at as updatedAt FROM orders WHERE user_id = ?`;
        const params = [userId];
        const result = await this.db.executeQuery<OrderEntity[]>(sql, params);
        return result;

    }


}
