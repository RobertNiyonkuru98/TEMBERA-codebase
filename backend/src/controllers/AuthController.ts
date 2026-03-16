import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/implementations/UserRepository';
import { ResponseHandler } from "../utils/response";
import { JWT_SECRET } from "@/utils/constants";
import { logger } from "@/utils/logger";

const userRepository = new UserRepository();

export class AuthController {

    // Registration

    async register(req: Request, res: Response) {
        try {
            const { name, email, password, phone_number } = req.body;

            // User in existance
            const existingUser = await userRepository.findByEmail(email);
            if (existingUser) {
                logger.warn(`User registration failed for email: ${email}`);
                return ResponseHandler.error(res,  'User already exists', 409);
            }

            // Password Hashing

            const hashedPassword = await bcrypt.hash(password, 10);

            // Saving to the Database

            const newUser = await userRepository.create({
                name,
                email,
                password: hashedPassword,
                phone_number
            });

            return ResponseHandler.success(res, 201, 'User creation and registration is successful', { userId: newUser.id});
        } catch (error) {
            logger.error('AuthController.ts\'s register has an Error:', error);
            return ResponseHandler.error(res, 'Internal server error during registration', 500);
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            // Finding the User

            const user = await userRepository.findByEmail(email);
            if (!user) {
                return res.status(401).json({message: 'Invalid Credentials'});
            }

            // Password verification by comparison

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({message: 'Invalid Credentials'});
            }

            // JWT Generation

            const token = jwt.sign(
                {userId: user.id.toString(), email: user.email},
                JWT_SECRET,
                {expiresIn: '1d'}
            );

            return ResponseHandler.success(res, 200, 'Login successful', { token });
        } catch (error) {
            logger.error('AuthController.ts\'s login has an Error:', error);
            return ResponseHandler.error(res, 'Internal server error during login', 500);
        }
    }
}