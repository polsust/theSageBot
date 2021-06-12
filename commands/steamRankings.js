const Discord = require("discord.js");
const client = new Discord.Client();
//Steam
const SteamAPI = require("steamapi");
const steam = new SteamAPI("F575C6A6CAB8A56FA969228CC23C262A");
//TODO: order by hours
const steamID = [
	"76561198298126172", //thePlaya
	"76561198299951692", //george
	"76561198317818722", //ddr
	"76561198295158985", //pol
	"76561198250690454", //mester
	"76561198269871030", //iago
	"76561198325178850", //rul
	"76561198442783501", //mauvy
	"76561199033323069", //marc
];

module.exports = {
	name: "s",
	description: "Get a full chart of the The Sages steam ranking",
	async execute(msg, args) {
		//get names and playtimes
		const user = [];
		for (let i = 0; i < steamID.length; i++) {
			const id = steamID[i];
			//get hoursPlaytime & transform it to days
			let hours = await getPlaytime(id);
			let days = hours / 24;
			days = days.toFixed(1);
			user.push({
				name: await getNames(id),
				playtime: hours,
				days: days,
			});
		}
		//sort by playtime
		user.sort((a, b) => parseFloat(b.playtime) - parseFloat(a.playtime));

		//embed
		let medals = [
			"[🥇]",
			"[🥈]",
			"[🥉]",
			"",
			"",
			"",
			"",
			"",
			"",
			"",
			"",
			"",
			"",
			"",
			"",
			"",
		];
		const embed = new Discord.MessageEmbed()
			.setColor("#f59342")
			.setTitle(
				"<:steam:852812448313507890>`Steam Rankings				📅" + getDate() + "`"
			);
		//get each user
		for (let i = 0; i < user.length; i++) {
			let name = user[i].name;
			let playtime = user[i].playtime;
			let days = user[i].days;
			let nSpaces = longestString(user) - user[i].name.length;

			var spaces = "           ";
			for (let i = 0; i < nSpaces; i++) {
				spaces += " ";
			}
			//Each user goes here
			embed.addFields({
				name: name + "" + spaces + "" + medals[i], //use emojis to set position in the ranking
				value: "`" + playtime + " h ⏱️\n" + days + " d`",
				inline: false,
			});
			/*TODO: create a database to store the playtime so you can compare it
			  to the new one and display how many hours has the user played since
			  the last time. Each time the command gets executed create a new row
			  with all the dataaaa*/
		}
		msg.channel.send(embed);
	},
};

function getPlaytime(id) {
	return new Promise(function (resolve, reject) {
		steam.getUserOwnedGames(id).then(
			(games) => {
				//hours
				let minutes = 0;
				for (let i = 0; i < games.length; i++) {
					minutes += games[i].playTime;

					// txt += games[i].name + " " + Math.round(games[i].playTime / 60) + "\n";
				}
				let hours = minutes / 60;
				hours = Math.round(hours);

				resolve(hours);
			},
			(error) => {
				reject(error);
			}
		);
	});
}

function getNames(id) {
	return new Promise(function (resolve, reject) {
		steam.getUserSummary(id).then(
			(summary) => {
				resolve(summary.nickname);
			},
			(error) => {
				reject(error);
			}
		);
	});
}
function getDate() {
	let date = new Date();
	let day = date.getDate();
	let month = date.getMonth() + 1;
	let year = date.getFullYear();

	return (today = `${day} / ${month} / ${year}`);
}
function longestString(strings) {
	let length = [];

	strings.forEach((element) => {
		length.push(element.name.length);
	});

	return (largestName = Math.max.apply(null, length));
}
