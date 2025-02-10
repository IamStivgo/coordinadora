import "reflect-metadata";
import { Container } from "inversify";
import { Types } from "./types";

import { IDatabase, DbSource } from "../infrastructure/database/dbSource";
import { IUserRepository } from "../domain/repositories/user.repository";
import { UserRepositoryImp } from "../infrastructure/repositories/mysql/userRepositoryImp";

import { UsersController } from "../adapters/controllers/users.controller";

const container = new Container({
    defaultScope: "Singleton",
});

container.bind<IDatabase>(Types.IDatabase).to(DbSource);

container.bind<IUserRepository>(Types.IUserRepository).to(UserRepositoryImp);

container.bind<UsersController>(Types.UsersController).to(UsersController);

export { container };
