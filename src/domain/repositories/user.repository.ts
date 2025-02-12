import { UserEntity,  CreateUserDTO, QueryUserDTO } from "../entities/user.entity";

export interface IUserRepository {
    create(user: CreateUserDTO): Promise<UserEntity | null>
    update(user: UserEntity): Promise<UserEntity>
    delete(id: string): Promise<boolean>
    findById(id: string): Promise<UserEntity | null>
    findByEmail(email: string): Promise<UserEntity | null>
    existsByEmail(email: string): Promise<boolean>
    existsByPhoneNumber(phoneNumber: string): Promise<boolean>
    getDrivers(params: QueryUserDTO): Promise<UserEntity[]>
    updateDriverLocation(userId: string, location: string): Promise<UserEntity>
}
