import { Request, Response } from "express";
import pool from "../models/db";


export const getAllUsers = async (req: Request, res: Response): Promise<any> => {
    console.log('get users')
    try {
        const [rows] = await pool.execute(`SELECT * FROM users`);
        console.log(`rows: ${rows}`)
        return res.status(200).json({ message: "Get users data successful", data: rows });
    }
    catch (error) {
        return res.status(400).json({ error: "Failed to get users data." });
    }
}