const db = require("./connect");

//INSERT
function insertNewRecord(users) {
	var request = `INSERT INTO steam_playtime SET`;

	for (let i = 0; i < users.length; i++) {
		request += ` user_${users[i].id}=${users[i].playtime},`;
	}
	request += ` date='${getDate()}'`;

	db.query(request, (err, result) => {
		if (err) console.error(err);

		lastId(result.insertId);
	});
}
function lastId(lastId) {
	if (lastId != undefined) this.id = lastId;

	return this.id;
}

//SELECT
function getRecord(value) {
	let id = lastId();
	console.log(value);
	if (value == "-") id -= 1;
	if (value == "+") id += 1;

	console.log(id);
	lastId(id);

	return new Promise((resolve, reject) => {
		var request = `SELECT * FROM steam_playtime where count_id=${id}`;
		db.query(request, (err, result) => {
			if (err) reject(err);

			resolve(result[0]);
		});
	});
}

module.exports = {
	insertNewRecord,
	getRecord,
};

function getDate() {
	let date = new Date();
	let day = date.getDate();
	let month = date.getMonth() + 1;
	let year = date.getFullYear();

	return (today = `${day}/${month}/${year}`);
}
