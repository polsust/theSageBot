var mysql = require("mysql");
const connection = mysql.createConnection({
	host: "eu-cdbr-west-01.cleardb.com",
	user: "b73c876890b450",
	password: "095db200",
	database: "heroku_22fcd43803d1ae6",
});

connection.connect((err) => {
	if (err) console.error("Erreur de la connection a la base de donées!");
});

module.exports = connection;
