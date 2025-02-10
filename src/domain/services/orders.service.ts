import { CreatePackageDTO } from "../entities/package.entity";

export const sumWeight = (packages: CreatePackageDTO[]) => {
    return packages.reduce((acc, p) => acc + p.weight, 0)
}
