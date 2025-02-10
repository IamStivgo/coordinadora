export enum OrderStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
}

export class OrderDetailsEntity {
    id?: string;
    orderId?: string;
    status: OrderStatus;
    createdAt: Date;
    updatedAt: Date;

    constructor(
        status: OrderStatus,
        createdAt: Date,
        updatedAt: Date,
        orderId?: string,
        id?: string
    ) {
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.orderId = orderId;
        this.id = id;
    }
}

export type CreateOrderDetailsDTO = Omit<OrderDetailsEntity, 'id' | 'createdAt' | 'updatedAt'>;

export type QueryOrderDetailsDTO = Partial<OrderDetailsEntity>;
