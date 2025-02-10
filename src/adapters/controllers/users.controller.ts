import { Request, Response } from "express";
import { Types } from "../../di/types";
import { IUserRepository } from "../../domain/repositories/user.repository";
import { inject, injectable } from "inversify";

@injectable()
export class UsersController {
    constructor(
        @inject(Types.IUserRepository) private userRepository: IUserRepository
    ) {}

    signUp = async (req: Request, res: Response) => {
        try {
            const user = await this.userRepository.create(req.body);
            return res.status(201).send(user);
        } catch (error) {
            console.log(error);
            return res.status(500).send({
                message: "Internal server error",
            });
        }
    };
}
