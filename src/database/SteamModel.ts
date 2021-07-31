import { SteamUser } from "../steamUser.interface";
import { DbConnect } from "./DbConnect";

type mode = "previous" | "next" | "first" | "last";
export class SteamModel extends DbConnect {
	private lastId: number = 0;

	insertNewRecord(users: SteamUser[]): Promise<any> {
		return new Promise((resolve, reject) => {
			var request = `INSERT INTO steam_playtime SET`;

			for (let i = 0; i < users.length; i++) {
				request += ` user_${users[i].id}=${users[i].playtime},`;
			}
			request += ` date='${this.getDate()}'`;

			this.db.query(request, (err: any, result: any) => {
				if (err) {
					console.error(err);
					reject(err);
				}
				resolve((this.lastId = result.insertId));
			});
		});
	}

	getRecord(value: mode, where?: any): Promise<any> {
		if (value === "previous") where = this.lastId -= 1;
		else if (value === "next") where = this.lastId += 1;
		else if (value === "first" || value === "last") this.lastId = where;

		return new Promise((resolve, reject) => {
			let request = `SELECT * FROM steam_playtime where count_id=${where}`;
			console.log(request);

			this.db.query(request, (err: any, result: any) => {
				if (err) {
					console.error(err);
					reject(err);
				}
				resolve(result[0]);
			});
		});
	}

	getAllRecords(): Promise<any> {
		return new Promise((resolve, reject) => {
			let request = `SELECT * FROM steam_playtime`;
			
			this.db.query(request, (err: any, result: any) => {
				if (err) {
					console.error(err);
					reject(err);
				}
				resolve(result);
			});
		});
	}

	getDate() {
		let today: string;

		let date = new Date();
		let day = date.getDate();
		let month = date.getMonth() + 1;
		let year = date.getFullYear();

		return (today = `${day}/${month}/${year}`);
	}
	getLastId(): number {
		return this.lastId;
	}
}
