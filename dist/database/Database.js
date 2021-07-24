"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lastId = exports.getRecord = exports.insertNewRecord = void 0;
const connect_1 = require("./connect");
//INSERT
function insertNewRecord(users) {
    console.log(users);
    var request = `INSERT INTO steam_playtime SET`;
    for (let i = 0; i < users.length; i++) {
        request += ` user_${users[i].id}=${users[i].playtime},`;
    }
    request += ` date='${getDate()}'`;
    connect_1.db.query(request, (err, result) => {
        if (err)
            console.error(err);
        lastId(result.insertId);
    });
}
exports.insertNewRecord = insertNewRecord;
function lastId(lastId) {
    // if (lastId != undefined) this.id = lastId;
    // return this.id;
}
exports.lastId = lastId;
//SELECT
function getRecord(value) {
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
exports.getRecord = getRecord;
function getDate() {
    let today;
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    return (today = `${day}/${month}/${year}`);
}
