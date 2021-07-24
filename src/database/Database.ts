import { SteamUser } from "../steamUser.interface";
import { db } from "./connect";

//INSERT
function insertNewRecord(users: SteamUser[]) {
	console.log(users);

	var request = `INSERT INTO steam_playtime SET`;

	for (let i = 0; i < users.length; i++) {
		request += ` user_${users[i].id}=${users[i].playtime},`;
	}
	request += ` date='${getDate()}'`;

	db.query(request, (err, result: any) => {
		if (err) console.error(err);

		lastId(result.insertId);
	});
}
function lastId(lastId?: number): number | void {
	// if (lastId != undefined) this.id = lastId;
	// return this.id;
}

//SELECT
function getRecord(value: string) {
	// let id = lastId();
	// console.log(value);
	// if (value == "-") id -= 1;
	// if (value == "+") id += 1;
	// lastId(id);
	// return new Promise((resolve, reject) => {
	// 	var request = `SELECT * FROM steam_playtime where count_id=${id}`;
	// 	db.query(request, (err, result) => {
	// 		if (err) reject(err);
	// 		resolve(result[0]);
	// 	});
	// });
}

export { insertNewRecord, getRecord, lastId };

function getDate() {
	let today: string;

	let date = new Date();
	let day = date.getDate();
	let month = date.getMonth() + 1;
	let year = date.getFullYear();

	return (today = `${day}/${month}/${year}`);
}
