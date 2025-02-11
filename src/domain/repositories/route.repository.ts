import { RouteEntity, CreateRouteDTO } from "../entities/route.entity"

export interface IRouteRepository {
    create(vehicle: CreateRouteDTO): Promise<RouteEntity | null>
    update(vehicle: RouteEntity): Promise<RouteEntity>
    delete(id: string): Promise<boolean>
    findById(id: string): Promise<RouteEntity | null>
}
