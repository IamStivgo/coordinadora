import { UserEntity,  CreateUserDTO } from "../entities/user.entity";

export interface IUserRepository {
    create(user: CreateUserDTO): Promise<UserEntity>
    update(user: UserEntity): Promise<UserEntity>
    delete(id: string): Promise<boolean>
    findById(id: string): Promise<UserEntity | null>
    findByEmail(email: string): Promise<UserEntity | null>
}
