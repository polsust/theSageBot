"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SteamModel = void 0;
const DbConnect_1 = require("./DbConnect");
class SteamModel extends DbConnect_1.DbConnect {
    constructor() {
        super(...arguments);
        this.lastId = 0;
    }
    insertNewRecord(users) {
        return new Promise((resolve, reject) => {
            var request = `INSERT INTO steam_playtime SET`;
            for (let i = 0; i < users.length; i++) {
                request += ` user_${users[i].id}=${users[i].playtime},`;
            }
            request += ` date='${this.getDate()}'`;
            this.db.query(request, (err, result) => {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                resolve((this.lastId = result.insertId));
            });
        });
    }
    getRecord(value) {
        console.log(value);
        if (value == "previous")
            this.lastId -= 1;
        if (value == "next")
            this.lastId += 1;
        return new Promise((resolve, reject) => {
            var request = `SELECT * FROM steam_playtime where count_id=${this.lastId}`;
            this.db.query(request, (err, result) => {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                resolve(result[0]);
            });
        });
    }
    getDate() {
        let today;
        let date = new Date();
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        return (today = `${day}/${month}/${year}`);
    }
    getLastId() {
        return this.lastId;
    }
}
exports.SteamModel = SteamModel;
