"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbConnect = void 0;
const mysql2_1 = __importDefault(require("mysql2"));
class DbConnect {
    constructor() {
        if (process.env.DB_HOST === undefined ||
            process.env.DB_USER === undefined ||
            process.env.DB_PASSWORD === undefined ||
            process.env.DB_BASE === undefined) {
            throw new Error("Environment variables DB_HOST, DB_USER, DB_PASSWORD and DB_BASE are required");
        }
        const host = process.env.DB_HOST.toString();
        const username = process.env.DB_USER.toString();
        const password = process.env.DB_PASSWORD.toString();
        const database = process.env.DB_BASE.toString();
        this.db = mysql2_1.default.createConnection({
            host: host,
            user: username,
            password: password,
            database: database,
        });
    }
}
exports.DbConnect = DbConnect;
