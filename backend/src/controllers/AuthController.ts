import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/implementations/UserRepository';
import { ResponseHandler } from "../utils/response";
import { JWT_SECRET } from "@/utils/constants";
import { logger } from "@/utils/logger";
import { ConflictError, NotFoundError, UnauthorizedError } from "@/utils/http-error";

const userRepository = new UserRepository();

export class AuthController {

    // Registration
    async register(req: Request, res: Response) {
        const { name, email, password, phone_number } = req.body;

        // User in existance
        const existingUser = await userRepository.findByEmail(email);
        if (existingUser) throw new ConflictError(`User registration failed for email: ${email}, Email already used`);

        // Password Hashing
        const hashedPassword = await bcrypt.hash(password, 10);

        // Saving to the Database
        const newUser = await userRepository.create({
            name,
            email,
            password: hashedPassword,
            phone_number
        });

        return ResponseHandler.success(res, 201, 'User creation and registration is successful', { userId: newUser.id });
    }

    async login(req: Request, res: Response) {
        const { email, password } = req.body;

        // Finding the User
        const user = await userRepository.findByEmail(email);
        if (!user) throw new NotFoundError(`User with ${email} not found`);

        // Password verification by comparison
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw new UnauthorizedError('Invalid Credentials');

        // JWT Generation
        const token = jwt.sign(
            { userId: user.id.toString(), email: user.email },
            JWT_SECRET,
            { expiresIn: '1d' }
        );
        return ResponseHandler.success(res, 200, 'Login successful', { token });
    }
}