import mysql from "mysql2";

export class DbConnect {
	protected db: any;

	constructor() {
		if (
			process.env.DB_HOST === undefined ||
			process.env.DB_USER === undefined ||
			process.env.DB_PASSWORD === undefined ||
			process.env.DB_BASE === undefined
		) {
			throw new Error(
				"Environment variables DB_HOST, DB_USER, DB_PASSWORD and DB_BASE are required"
			);
		}

		const host = process.env.DB_HOST.toString();
		const username = process.env.DB_USER.toString();
		const password = process.env.DB_PASSWORD.toString();
		const database = process.env.DB_BASE.toString();

		this.db = mysql.createConnection({
			host: host,
			user: username,
			password: password,
			database: database,
		});
	}
}
