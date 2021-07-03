var mysql = require("mysql");
const { host, user, password, database } = require("./dbConfig.json");

const connection = mysql.createConnection({
	host,
	user,
	password,
	database,
});

connection.connect((err) => {
	if (err) console.error("Erreur de la connection a la base de donées!");
});

module.exports = connection;
