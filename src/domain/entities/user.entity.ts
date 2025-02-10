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
	currentLocation?: string

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
		id?: string,
		currentLocation?: string
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
		this.currentLocation = currentLocation
	}
}

export type CreateUserDTO = Omit<UserEntity, "id" | "createdAt" | "updatedAt" | "verified" | "currentLocation">

export type QueryUserDTO = Partial<UserEntity>
