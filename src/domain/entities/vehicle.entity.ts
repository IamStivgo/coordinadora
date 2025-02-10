export class vehicleEntity {
    id: string;
    brand: string;
    model: string;
    licensePlate: string;
    capacity: number;
    currentLocation: string;
    maxWeight: number;
    createdAt: Date;
    updatedAt: Date;

    constructor(
        id: string,
        brand: string,
        model: string,
        licensePlate: string,
        capacity: number,
        currentLocation: string,
        maxWeight: number,
        createdAt: Date,
        updatedAt: Date
    ) {
        this.id = id;
        this.brand = brand;
        this.model = model;
        this.licensePlate = licensePlate;
        this.capacity = capacity;
        this.currentLocation = currentLocation;
        this.maxWeight = maxWeight;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

} 

export type CreateVehicleDTO = Omit<vehicleEntity, "id" | "created_at" | "updated_at">

export type QueryVehicleDTO = Partial<vehicleEntity>
