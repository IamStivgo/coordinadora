import { injectable } from 'inversify';
import mysql from 'mysql2/promise';
import config from '../../config';

export interface IDatabase {
    connectDb(): Promise<Boolean>;
    executeQuery<T>(sql: string, params?: (string | number | boolean | Date | undefined)[]): Promise<T>;
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
            await this.connection.query(this.queryCreateUserTable);
            await this.connection.query(this.queryCreateVehicleTable);
            await this.connection.query(this.queryCreateRouteTable);
            await this.connection.query(this.queryCreateOrderTables);
            await this.connection.query(this.queryCreatePackageTable);
            await this.connection.query(this.queryCreateOrderDetailTable);
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

    private queryCreateUserTable: string = `
        CREATE TABLE IF NOT EXISTS users (
            id VARCHAR(255) PRIMARY KEY,
            first_name VARCHAR(255) NOT NULL,
            last_name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            phone_number VARCHAR(255) NOT NULL UNIQUE,
            verified BOOLEAN NOT NULL DEFAULT FALSE,
            current_location VARCHAR(255),
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            role ENUM('admin', 'client', 'driver')
        );
        `;
    private queryCreateVehicleTable: string = `
        CREATE TABLE IF NOT EXISTS vehicles (
            id VARCHAR(255) PRIMARY KEY,
            brand VARCHAR(255) NOT NULL,
            model VARCHAR(255) NOT NULL,
            license_plate VARCHAR(255) NOT NULL UNIQUE,
            capacity DECIMAL(10, 3) NOT NULL,
            current_location VARCHAR(255),
            max_weight DECIMAL(10, 3) NOT NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
    `;

    private queryCreateRouteTable: string = `
        CREATE TABLE IF NOT EXISTS routes (
            id VARCHAR(255) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            origin VARCHAR(255) NOT NULL,
            destination VARCHAR(255) NOT NULL,
            distance DECIMAL(10, 3) NOT NULL,
            departure_time TIME NOT NULL,
            departure_date DATE NOT NULL,
            arrival_time TIME NOT NULL,
            arrival_date DATE NOT NULL,
            driver_id VARCHAR(255),
            vehicle_id VARCHAR(255),
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (driver_id) REFERENCES users(id),
            FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
        );
    `;

    private queryCreateOrderTables: string = `
        CREATE TABLE IF NOT EXISTS orders (
            id VARCHAR(255) PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            recipient_name VARCHAR(255) NOT NULL,
            recipient_phone_number VARCHAR(255) NOT NULL,
            recipient_address VARCHAR(255) NOT NULL,
            number BIGINT NOT NULL UNIQUE AUTO_INCREMENT,
            total_weight DECIMAL(10, 3) NOT NULL,
            route_id VARCHAR(255),
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (route_id) REFERENCES routes(id)
        );
        `;
    private queryCreatePackageTable: string = `
        CREATE TABLE IF NOT EXISTS packages (
            id VARCHAR(255) PRIMARY KEY,
            order_id VARCHAR(255) NOT NULL,
            weight DECIMAL(10, 3) NOT NULL,
            width DECIMAL(10, 3) NOT NULL,
            height DECIMAL(10, 3) NOT NULL,
            depth DECIMAL(10, 3) NOT NULL,
            kind ENUM('box', 'envelope') NOT NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (order_id) REFERENCES orders(id)
        );
    `;

    private queryCreateOrderDetailTable: string = `
        CREATE TABLE IF NOT EXISTS order_details (
            id VARCHAR(255) PRIMARY KEY,
            order_id VARCHAR(255) NOT NULL,
            status ENUM('pending', 'in_progress', 'completed') NOT NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (order_id) REFERENCES orders(id)
        );
    `;
}
