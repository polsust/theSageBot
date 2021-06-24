var db = require("./connect");

module.exports = class Database {
	//DB connection
	constructor() {}
	//INSERT
	static insertNewRecord(steamId, hours) {
		db.query(
			`INSERT INTO steam_playtime SET steam_user_id='${steamId}', hours=${hours}`,
			(err, result) => {
				if (err) {
					console.error(err);
				} else {
					console.log("Insert successful");
				}
			}
		);
	}
	static selectAll(steamId, hours) {
		db.query(
			`INSERT INTO steam_playtime SET steam_user_id='${steamId}', hours=${hours}`,
			(err, result) => {
				if (err) {
					console.error(err);
				} else {
					console.log("Insert successful");
				}
			}
		);
	}
};
