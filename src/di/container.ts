import "reflect-metadata";
import { Container } from "inversify";
import { Types } from "./types";

import { IDatabase, DbSource } from "../infrastructure/database/dbSource";
import { IUserRepository } from "../domain/repositories/user.repository";
import { UserRepositoryImp } from "../infrastructure/repositories/mysql/userRepositoryImp";
import { IOrderRepository } from "../domain/repositories/order.repository";
import { OrderRepositoryImp } from "../infrastructure/repositories/mysql/orderRepositoryImp";

import { UsersController } from "../adapters/controllers/users.controller";
import { OrdersController } from "../adapters/controllers/orders.controller";

const container = new Container({
    defaultScope: "Singleton",
});

container.bind<IDatabase>(Types.IDatabase).to(DbSource);

container.bind<IUserRepository>(Types.IUserRepository).to(UserRepositoryImp);
container.bind<IOrderRepository>(Types.IOrderRepository).to(OrderRepositoryImp);

container.bind<UsersController>(Types.UsersController).to(UsersController);
container.bind<OrdersController>(Types.OrdersController).to(OrdersController);

export { container };
