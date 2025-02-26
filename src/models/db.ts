import mysql from 'mysql2/promise';
import dotenv from "dotenv";
dotenv.config();

const pool = mysql.createPool({
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});


export default pool;
