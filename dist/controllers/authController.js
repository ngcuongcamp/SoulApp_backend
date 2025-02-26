"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = __importDefault(require("../models/db"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'soulsecretkey';
const check_exists = (field, value) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield db_1.default.execute(`SELECT * FROM users WHERE ${field} = ?`, [value]);
        return rows.length > 0;
    }
    catch (error) {
        console.error(error);
        return false;
    }
});
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    try {
        if (yield check_exists('username', username)) {
            return res.status(400).json({ error: "Username already exists" });
        }
        if (yield check_exists("email", email)) {
            return res.status(400).json({ error: "Email already exists" });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, SALT_ROUNDS);
        const [result] = yield db_1.default.execute("INSERT INTO users(username, email, password) VALUES(?, ?, ?)", [username, email, hashedPassword]);
        return res.status(201).json({ message: 'User registered successfully!', userId: result.insertId });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to register user' });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const [rows] = yield db_1.default.execute("SELECT * FROM users WHERE email = ?", [email]);
        const user = rows[0];
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials." });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id }, JWT_SECRET, { expiresIn: "24h" });
        return res.status(200).json({ message: 'Logged in successfully', token });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to login" });
    }
});
exports.login = login;
