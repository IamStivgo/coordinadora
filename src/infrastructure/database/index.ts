import { IDatabase } from "./dbSource";
import { container } from "../../di/container";
import { Types } from "../../di/types";
import { ICacheDb } from "./cacheSource";

const db = container.get<IDatabase>(Types.IDatabase);
const dbCache = container.get<ICacheDb>(Types.ICacheDb);

export const connectDb = async () => {
    return await db.connectDb();
};

export const connectCache = async () => {
    return await dbCache.connectDb();
};

export const executeQuery = async <T>(sql: string, params?: (string | number | boolean | Date | undefined)[]): Promise<T> => {
    return await db.executeQuery<T>(sql, params);
};
