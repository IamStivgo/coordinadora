import { inject, injectable } from "inversify";
import { v4 } from "uuid";
import { Types } from "../../../di/types";
import { UserEntity, CreateUserDTO } from "../../../domain/entities/user.entity";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { IDatabase } from "../../database/dbSource";

@injectable()
export class UserRepositoryImp implements IUserRepository {
    constructor(
        @inject(Types.IDatabase) 
        private db: IDatabase
    ){}

    async create(user: CreateUserDTO): Promise<UserEntity> {
        const { firstName, lastName, email, phoneNumber, password, role } = user;
        const id = v4();
        const query = `INSERT INTO users (id, first_name, last_name, email, phone_number, password, role ) VALUES (?,?, ?, ?, ?, ?, ?)`;
        const values = [id, firstName, lastName, email, phoneNumber, password, role];
        const result = await this.db.executeQuery<UserEntity>(query, values);
        return result;
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

    async findById(id: string): Promise<UserEntity | null> {
        const query = `SELECT id, first_name as firstName, last_name as lastName, email, phone_number as phoneNumber FROM users WHERE id = ?`;
        const values = [id];
        const result = await this.db.executeQuery<UserEntity[]>(query, values);
        return result.length > 0 ? result[0] : null;
    }

    async findByEmail(email: string): Promise<UserEntity | null> {
        const query = `SELECT id, first_name as firstName, last_name as lastName, email, phone_number as phoneNumber FROM users WHERE email = ?`;
        const values = [email];
        const result = await this.db.executeQuery<UserEntity[]>(query, values);
        return result.length > 0 ? result[0] : null;
    }

}
