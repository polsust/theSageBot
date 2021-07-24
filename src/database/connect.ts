import mysql from "mysql2";
import { host, user, password, database } from "./dbConfig.json";

// create the connection to database
export const db = mysql.createConnection({
	host,
	user,
	password,
	database,
});
