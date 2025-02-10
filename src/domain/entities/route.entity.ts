export class RouteEntity {
    id: string;
    name: string;
    origin: string;
    destination: string;
    distance: number;
    departureTime: string;
    departureDate: string;
    arrivalTime?: string;
    arrivalDate?: string;
    driverId?: string;
    vehicleId?: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(
        id: string,
        name: string,
        origin: string,
        destination: string,
        distance: number,
        departureTime: string,
        departureDate: string,
        arrivalTime: string,
        arrivalDate: string,
        driverId: string,
        vehicleId: string,
        createdAt: Date,
        updatedAt: Date
    ) {
        this.id = id;
        this.name = name;
        this.origin = origin;
        this.destination = destination;
        this.distance = distance;
        this.departureTime = departureTime;
        this.departureDate = departureDate;
        this.arrivalTime = arrivalTime;
        this.arrivalDate = arrivalDate;
        this.driverId = driverId;
        this.vehicleId = vehicleId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

}

export type CreateRouteDTO = Omit<RouteEntity, "id" |  "arrivalTime" | "arrivalDate" |  "createdAt" | "updatedAt">
export type QueryRouteDTO = Partial<RouteEntity>
