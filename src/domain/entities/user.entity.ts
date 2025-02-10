export enum UserRole {
	ADMIN = 'admin',
	CLIENT = 'client',
	DRIVER = 'driver'
}

export class UserEntity {
	id?: string
	firstName: string
	lastName: string
	email: string
	password?: string
	phoneNumber: string
	verified: boolean
	createdAt: Date
	updatedAt: Date
	role?: UserRole

	constructor(
		firstName: string,
		lastName: string,
		email: string,
		phoneNumber: string,
		verified: boolean,
		createdAt: Date,
		updatedAt: Date,
		role?: UserRole,
		password?: string,
		id?: string
	) {
		this.firstName = firstName
		this.lastName = lastName
		this.email = email
		this.phoneNumber = phoneNumber
		this.verified = verified
		this.createdAt = createdAt
		this.updatedAt = updatedAt
		this.role = role
		this.password = password
		this.id = id
	}
}

export type CreateUserDTO = Omit<UserEntity, "id | createdAt" | "updatedAt" | "verified">

export type QueryUserDTO = Partial<UserEntity>

