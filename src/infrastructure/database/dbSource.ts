import { injectable } from 'inversify';
import mysql from 'mysql2/promise';
import config from '../../config';

export interface IDatabase {
    connectDb(): Promise<Boolean>;
    executeQuery<T>(sql: string, params?: (string | number | boolean | Date |undefined)[]): Promise<T>;    
}

@injectable()
export class DbSource implements IDatabase {
    private connection: mysql.Connection | null = null;

    async connectDb(): Promise<Boolean> {
        try {
            this.connection = await mysql.createConnection({
                host: config.DB_HOST,
                user: config.DB_USER,
                password: config.DB_PASSWORD,
                database: config.DB_NAME,
                port: config.DB_PORT,
            });

            console.log('Database connected');

            this.createTables();

            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    async createTables(): Promise<Boolean> {
        if (!this.connection) {
            console.error('Database connection not established');
            return false;
        }

        try {
            await this.connection.query(`
                CREATE TABLE IF NOT EXISTS users (
                    id VARCHAR(255) PRIMARY KEY,
                    first_name VARCHAR(255) NOT NULL,
                    last_name VARCHAR(255) NOT NULL,
                    email VARCHAR(255) NOT NULL UNIQUE,
                    password VARCHAR(255) NOT NULL,
                    phone_number VARCHAR(255) NOT NULL UNIQUE,
                    verified BOOLEAN NOT NULL DEFAULT FALSE,
                    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    role ENUM('admin', 'client', 'driver')
                );
            `);
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    async executeQuery<T>(sql: string, params?: (string | number | boolean | undefined)[]): Promise<T> {
        if (!this.connection) {
            throw new Error('Database connection not established');
        }

        const [rows] = await this.connection.execute(sql, params);

        return rows as T;
    }
}
