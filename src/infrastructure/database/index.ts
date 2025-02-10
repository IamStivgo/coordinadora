import { IDatabase } from "./dbSource";
import { container } from "../../di/container";
import { Types } from "../../di/types";

const db = container.get<IDatabase>(Types.IDatabase);

export const connectDb = async () => {
    return await db.connectDb();
};

export const executeQuery = async <T>(sql: string, params?: (string | number | boolean)[]): Promise<T> => {
    return await db.executeQuery<T>(sql, params);
};
