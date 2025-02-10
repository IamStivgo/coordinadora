import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { QueryUserDTO } from '../entities/user.entity';
import config from '../../config';

export const generateHash = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

export const compareHash = async (password: string, hash: string | undefined): Promise<boolean> => {
    return bcrypt.compare(password, hash || '');
};

export const generateToken = async (payload: QueryUserDTO): Promise<string> => {
    return jwt.sign(payload, config.JWT_SECRET, {
        expiresIn: '1d',
    });
}