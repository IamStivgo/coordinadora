export enum PackageKind{
    BOX = "BOX",
    ENVELOPE = "ENVELOPE",
}

export class PackageEntity {
    id?: string
    orderId?: string
    weight: number
    width: number
    height: number
    depth: number
    kind: PackageKind
    createdAt: Date
    updatedAt: Date

    constructor(
        weight: number,
        width: number,
        height: number,
        depth: number,
        kind: PackageKind,
        createdAt: Date,
        updatedAt: Date,
        orderId?: string,
        id?: string
    ) {
        this.weight = weight
        this.width = width
        this.height = height
        this.depth = depth
        this.kind = kind
        this.createdAt = createdAt
        this.updatedAt = updatedAt
        this.orderId = orderId
        this.id = id
    }
}

export type CreatePackageDTO = Omit<PackageEntity, "id" | "createdAt" | "updatedAt">

export type QueryPackageDTO = Partial<PackageEntity>
