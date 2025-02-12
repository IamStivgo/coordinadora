import { inject, injectable } from "inversify";
import { v4 } from "uuid";
import { Types } from "../../../di/types";
import { UserEntity, CreateUserDTO, QueryUserDTO } from "../../../domain/entities/user.entity";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { IDatabase } from "../../database/dbSource";

@injectable()
export class UserRepositoryImp implements IUserRepository {
    constructor(
        @inject(Types.IDatabase) 
        private db: IDatabase
    ){}

    async create(user: CreateUserDTO): Promise<UserEntity | null> {
        const { firstName, lastName, email, phoneNumber, password, role, currentLocation } = user;
        const id = v4();
        const query = `INSERT INTO users (id, first_name, last_name, email, phone_number, password, role, current_location) VALUES (?,?, ?, ?, ?, ?, ?, ?)`;
        const values = [id, firstName, lastName, email, phoneNumber, password, role, currentLocation || null];
        await this.db.executeQuery<UserEntity>(query, values);
        const userResponse = this.findById(id);
        return userResponse;
    }

    async update(user: UserEntity): Promise<UserEntity> {
        const { id, firstName, lastName, email, phoneNumber, password, verified, createdAt, updatedAt, role } = user;
        const query = `UPDATE users SET first_name = ?, last_name = ?, email = ?, phone_number = ?, password = ?, verified = ?, created_at = ?, updated_at = ?, role = ? WHERE id = ?`;
        const values = [firstName, lastName, email, phoneNumber, password, verified, createdAt, updatedAt, role, id];
        await this.db.executeQuery<UserEntity>(query, values);
        return user;
    }

    async delete(id: string): Promise<boolean> {
        const query = `DELETE FROM users WHERE id = ?`;
        const values = [id];
        await this.db.executeQuery(query, values);
        return true;
    }

    async findByEmail(email: string): Promise<UserEntity | null> {
        const query = `SELECT id, first_name as firstName, last_name as lastName, email, phone_number as phoneNumber, password, role FROM users WHERE email = ?`;
        const values = [email];
        const result = await this.db.executeQuery<UserEntity[]>(query, values);
        return result.length > 0 ? result[0] : null;
    }

    async findById(id: string): Promise<UserEntity | null> {
        const query = `SELECT id, first_name as firstName, last_name as lastName, email, phone_number as phoneNumber, current_location as currentLocation FROM users WHERE id = ?`;
        const values = [id];
        const result = await this.db.executeQuery<UserEntity[]>(query, values);
        return result.length > 0 ? result[0] : null;
    }

    async existsByEmail(email: string): Promise<boolean> {
        const query = `SELECT id FROM users WHERE email = ?`;
        const values = [email];
        const result = await this.db.executeQuery<UserEntity[]>(query, values);
        return result.length > 0;
    }

    async existsByPhoneNumber(phoneNumber: string): Promise<boolean> {
        const query = `SELECT id FROM users WHERE phone_number = ?`;
        const values = [phoneNumber];
        const result = await this.db.executeQuery<UserEntity[]>(query, values);
        return result.length > 0;
    }

    async getDrivers(params: QueryUserDTO): Promise<UserEntity[]> {
        const { currentLocation } = params;
        const query = `SELECT id, first_name as firstName, last_name as lastName, email, phone_number as phoneNumber, current_location as currentLocation 
            FROM users 
            WHERE role = 'driver'
            AND current_location LIKE '${currentLocation}%'
        `;
        const result = await this.db.executeQuery<UserEntity[]>(query);
        return result;
    }

    async updateDriverLocation(userId: string, location: string): Promise<UserEntity> {
        const query = `UPDATE users SET current_location = ? WHERE id = ?`;
        const values = [location, userId];
        await this.db.executeQuery<UserEntity>(query, values);
        const user = await this.findById(userId);
        if (!user) {
            throw new Error(`User with id ${userId} not found`);
        }
        return user;
    }

}
