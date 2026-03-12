import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/implementations/UserRepository';
import { ResponseHandler } from "../utils/response";

const userRepository = new UserRepository();
const JWT_SECRET = process.env.JWT_SECRET || 'Tembera@2026';

export class AuthController {

    // Registration

    async register(req: Request, res: Response) {
        const { name, email, password, phone_number } = req.body;

        // User in existance
        const existingUser = await userRepository.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({message: 'User already exists'});
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
    }

    async login(req: Request, res: Response) {
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
    }
}