"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = require("body-parser");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const usersRoutes_1 = __importDefault(require("./routes/usersRoutes"));
const app = (0, express_1.default)();
app.use((0, body_parser_1.json)());
app.use('/auth', authRoutes_1.default);
app.use('/users', usersRoutes_1.default);
// app.get('/users', (req: Request, res: Response) => {
//     console.log("test");
//     res.send("It work!");
// })
const PORT = process.env.PORT || 8686;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
