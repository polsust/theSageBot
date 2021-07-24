"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const mysql2_1 = __importDefault(require("mysql2"));
const dbConfig_json_1 = require("./dbConfig.json");
// create the connection to database
exports.db = mysql2_1.default.createConnection({
    host: dbConfig_json_1.host,
    user: dbConfig_json_1.user,
    password: dbConfig_json_1.password,
    database: dbConfig_json_1.database,
});