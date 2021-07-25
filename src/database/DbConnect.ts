import mysql from "mysql2";
import { host, user, password, database } from "./dbConfig.json";

export class DbConnect {
	protected db: any;

	constructor() {
		this.db = mysql.createConnection({
			host,
			user,
			password,
			database,
		});
	}
}
