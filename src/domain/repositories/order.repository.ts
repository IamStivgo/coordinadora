import { OrderEntity, CreateOrderDTO } from "../entities/order.entity";

export interface IOrderRepository {
    create(order: CreateOrderDTO): Promise<OrderEntity | null>
    update(order: OrderEntity): Promise<OrderEntity>
    delete(id: string): Promise<boolean>
    findById(id: string): Promise<OrderEntity | null>
    findByNumber(orderNumber: string): Promise<OrderEntity | null>
    findByUserId(userId: string): Promise<OrderEntity[]>
}
