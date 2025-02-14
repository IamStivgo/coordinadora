import "reflect-metadata";
import { Container } from "inversify";
import { Types } from "./types";

import { IDatabase, DbSource } from "../infrastructure/database/dbSource";
import { ICacheDb, CacheSource } from "../infrastructure/database/cacheSource";
import { IUserRepository } from "../domain/repositories/user.repository";
import { UserRepositoryImp } from "../infrastructure/repositories/mysql/userRepositoryImp";
import { IOrderRepository } from "../domain/repositories/order.repository";
import { OrderRepositoryImp } from "../infrastructure/repositories/mysql/orderRepositoryImp";
import { IPackageRepository } from "../domain/repositories/package.repository";
import { PackageRepositoryImp } from "../infrastructure/repositories/mysql/packageRepositoryImp";
import { IOrderDetailRepository } from "../domain/repositories/orderDetail.repository";
import { OrderDetailRepositoryImp } from "../infrastructure/repositories/mysql/orderDetailRepositoryImp";
import { IVehicleRepository } from "../domain/repositories/vehicle.repository";
import { VehicleRepositoryImp } from "../infrastructure/repositories/mysql/vehicleRepositoryImp";
import { IRouteRepository } from "../domain/repositories/route.repository";
import { RouteRepositoryImp } from "../infrastructure/repositories/mysql/routeRepositoryImp";
import { ICacheRepository } from "../domain/repositories/cache.repository";
import { CacheRepositoryImp } from "../infrastructure/repositories/redis";

import { UsersController } from "../adapters/controllers/users.controller";
import { OrdersController } from "../adapters/controllers/orders.controller";
import { RoutesController } from "../adapters/controllers/routes.controller";
import { VehiclesController } from "../adapters/controllers/vehicles.controller";

const container = new Container({
    defaultScope: "Singleton",
});

container.bind<IDatabase>(Types.IDatabase).to(DbSource);
container.bind<ICacheDb>(Types.ICacheDb).to(CacheSource);

container.bind<IUserRepository>(Types.IUserRepository).to(UserRepositoryImp);
container.bind<IOrderRepository>(Types.IOrderRepository).to(OrderRepositoryImp);
container.bind<IPackageRepository>(Types.IPackageRepository).to(PackageRepositoryImp);
container.bind<IOrderDetailRepository>(Types.IOrderDetailRepository).to(OrderDetailRepositoryImp);
container.bind<IVehicleRepository>(Types.IVehicleRepository).to(VehicleRepositoryImp );
container.bind<IRouteRepository>(Types.IRouteRepository).to(RouteRepositoryImp);
container.bind<ICacheRepository>(Types.ICacheRepository).to(CacheRepositoryImp);

container.bind<UsersController>(Types.UsersController).to(UsersController);
container.bind<OrdersController>(Types.OrdersController).to(OrdersController);
container.bind<RoutesController>(Types.RoutesController).to(RoutesController);
container.bind<VehiclesController>(Types.VehiclesController).to(VehiclesController);

export { container };
