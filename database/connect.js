const mysql = require("mysql2");
const { host, user, password, database } = require("./dbConfig.json");

// create the connection to database
const connection = mysql.createConnection({
	host,
	user,
	password,
	database,
});
module.exports = connection;
