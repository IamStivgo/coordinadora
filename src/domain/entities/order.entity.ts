import { QueryPackageDTO } from "./package.entity"

export class OrderEntity {
	id?: string
	userId?: string
    recipientAddress: string
    recipientName: string
    recipientPhoneNumber: string
    totalWeight: number
    packages?: QueryPackageDTO[]
    number?: number
    createdAt: Date
	updatedAt: Date

	constructor(
        recipientAddress: string,
        recipientName: string,
        recipientPhoneNumber: string,
        totalWeight: number,
        createdAt: Date,
        updatedAt: Date,
        userId?: string,
        id?: string,
        number?: number,
        packages?: QueryPackageDTO[]
    ) {
        this.recipientAddress = recipientAddress
        this.recipientName = recipientName
        this.recipientPhoneNumber = recipientPhoneNumber
        this.totalWeight = totalWeight
        this.createdAt = createdAt
        this.updatedAt = updatedAt
        this.userId = userId
        this.id = id
        this.number = number
        this.packages = packages
    }
}

export type CreateOrderDTO = Omit<OrderEntity, "id | createdAt" | "updatedAt" >

export type QueryOrderDTO = Partial<OrderEntity>
