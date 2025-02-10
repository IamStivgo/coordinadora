import { OrderDetailsEntity, CreateOrderDetailsDTO } from "../entities/orderDetails.entity";

export interface IOrderDetailRepository {
    create(orderDetails: CreateOrderDetailsDTO): Promise<OrderDetailsEntity | null>
    update(orderDetails: OrderDetailsEntity): Promise<OrderDetailsEntity>
    delete(id: string): Promise<boolean>
    findById(id: string): Promise<OrderDetailsEntity | null>
    findByOrderId(orderId: string): Promise<OrderDetailsEntity[]>
}
