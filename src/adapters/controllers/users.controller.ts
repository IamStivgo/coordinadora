import { Request, Response } from "express";
import { Types } from "../../di/types";
import { IUserRepository } from "../../domain/repositories/user.repository";
import { inject, injectable } from "inversify";
import { compareHash, generateHash, generateToken } from "../../domain/services/user.services";
import { UserRole } from "../../domain/entities/user.entity";

@injectable()
export class UsersController {
	constructor(
		@inject(Types.IUserRepository) private userRepository: IUserRepository
	) { }

	signUp = async (req: Request, res: Response) => {
		try {
			const { email, phoneNumber, password } = req.body;
			const userEmailExists = await this.userRepository.existsByEmail(email);
			if (userEmailExists) {
				return res.status(409).send({
					success: false,
					message: "User already exists",
				});
			}

			const userPhoneNumberExists = await this.userRepository.existsByPhoneNumber(phoneNumber);
			if (userPhoneNumberExists) {
				return res.status(409).send({
					success: false,
					message: "Phone number already exists",
				});
			}

			const hash = await generateHash(password);

			const payload = {
				...req.body,
				password: hash,
				role: UserRole.CLIENT,
			};

			const user = await this.userRepository.create(payload);

			if (!user) {
				return res.status(400).send({
					success: false,
					message: "Error creating user",
				});
			}

			return res.status(201).send({
				success: true,
				message: "User created successfully",
				data: user,
			});
		} catch (error) {
			console.log(error);
			return res.status(500).send({
				message: "Internal server error",
			});
		}
	};

	signIn = async (req: Request, res: Response) => {
		try {
			const { email, password } = req.body;
			const user = await this.userRepository.findByEmail(email);

			if (!user) {
				return res.status(404).send({
					success: false,
					message: "User not found",
				});
			}

			const validPassword = await compareHash(password, user.password);

			if (!validPassword) {
				return res.status(401).send({
					success: false,
					message: "Invalid password",
				});
			}

			const userObj = {
				id: user.id,
				email: user.email,
				phoneNumber: user.phoneNumber,
				role: user.role,
			};

			const token = await generateToken(userObj);

			return res.status(200).send({
				success: true,
				token,
			});
		} catch (error) {
			console.log(error);
			return res.status(500).send({
				message: "Internal server error",
			});
		}
	};
}
