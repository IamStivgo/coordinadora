import { QueryPackageDTO } from "./package.entity"

export class OrderEntity {
	id?: string
	userId?: string
    routeId?: string
    originCity: string
    recipientAddress: string
    recipientCity: string
    recipientPostalCode: string
    recipientName: string
    recipientPhoneNumber: string
    totalWeight: number
    packages?: QueryPackageDTO[]
    number?: number
    createdAt: Date
	updatedAt: Date

	constructor(
        originCity: string,
        recipientAddress: string,
        recipientName: string,
        recipientPhoneNumber: string,
        recipientCity: string,
        recipientPostalCode: string,
        totalWeight: number,
        createdAt: Date,
        updatedAt: Date,
        userId?: string,
        id?: string,
        number?: number,
        packages?: QueryPackageDTO[],
        routeId?: string
    ) {
        this.originCity = originCity
        this.recipientAddress = recipientAddress
        this.recipientCity = recipientCity
        this.recipientPostalCode = recipientPostalCode
        this.recipientName = recipientName
        this.recipientPhoneNumber = recipientPhoneNumber
        this.totalWeight = totalWeight
        this.createdAt = createdAt
        this.updatedAt = updatedAt
        this.userId = userId
        this.id = id
        this.number = number
        this.packages = packages
        this.routeId = routeId
    }
}

export type CreateOrderDTO = Omit<OrderEntity, "id" | "number" | "packages" | "routerId" | "createdAt" | "updatedAt" >

export type QueryOrderDTO = Partial<OrderEntity>
