import { RouteEntity, CreateRouteDTO } from "../entities/route.entity"

export interface IRouteRepository {
    create(route: CreateRouteDTO): Promise<RouteEntity | null>
    update(route: RouteEntity): Promise<RouteEntity>
    delete(id: string): Promise<boolean>
    findById(id: string): Promise<RouteEntity | null>
    findByOriginAndDestination(origin: string, destination: string): Promise<RouteEntity[] | null>
}
