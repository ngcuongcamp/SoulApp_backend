import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import pool from "../models/db";
import jwt from "jsonwebtoken";

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'soulsecretkey';

const check_exists = async (field: string, value: string): Promise<boolean> => {
    try {
        const [rows] = await pool.execute(`SELECT * FROM users WHERE ${field} = ?`, [value]);
        return (rows as any[]).length > 0;
    } catch (error) {
        console.error(error);
        return false;
    }
};

export const register = async (req: Request, res: Response): Promise<any> => {
    const { username, email, password } = req.body;
    try {
        if (await check_exists('username', username)) {
            return res.status(400).json({ error: "Username already exists" });
        }
        if (await check_exists("email", email)) {
            return res.status(400).json({ error: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const [result]: any = await pool.execute(
            "INSERT INTO users(username, email, password) VALUES(?, ?, ?)",
            [username, email, hashedPassword]
        );

        return res.status(201).json({ message: 'User registered successfully!', userId: result.insertId });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to register user' });
    }
};

export const login = async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;
    try {
        const [rows]: any = await pool.execute("SELECT * FROM users WHERE email = ?", [email]);
        const user = rows[0];

        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials." });
        }

        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "24h" });

        return res.status(200).json({ message: 'Logged in successfully', token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to login" });
    }
};
