import { PackageEntity, CreatePackageDTO } from "../entities/package.entity";

export interface IPackageRepository {
    create(orderPackage: CreatePackageDTO): Promise<PackageEntity | null>
    update(orderPackage: PackageEntity): Promise<PackageEntity>
    delete(id: string): Promise<boolean>
    findById(id: string): Promise<PackageEntity | null>
    findByOrderId(orderId: string): Promise<PackageEntity[]>
}
