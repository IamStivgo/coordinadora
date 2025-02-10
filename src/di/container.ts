import "reflect-metadata";
import { Container } from "inversify";
import { Types } from "./types";

import { IDatabase, DbSource } from "../infrastructure/database/dbSource";

const container = new Container({
    defaultScope: "Singleton",
});

container.bind<IDatabase>(Types.IDatabase).to(DbSource);

export { container };
