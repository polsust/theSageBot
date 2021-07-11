const Discord = require("discord.js");
const client = new Discord.Client();

//Steam
const SteamAPI = require("steamapi");
const { steamToken } = require("../config.json");
const steam = new SteamAPI(steamToken);
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
//DATABASE
const { insertNewRecord, getRecord } = require("../database/Database");

module.exports = {
	name: "s",
	async execute(msg, args) {
		//get names and playtimes
		const user = [];
		for (let i = 0; i < steamID.length; i++) {
			const id = steamID[i];
			//get hoursPlaytime of all the users
			let hours = await getPlaytime(id);
			let days = hours / 24;
			days = days.toFixed(1);
			user.push({
				id,
				name: await getNames(id),
				playtime: hours,
				days: days,
			});
		}
		insertNewRecord(user);

		//sort by playtime
		user.sort((a, b) => parseFloat(b.playtime) - parseFloat(a.playtime));

		let embed = createEmbed(user);

		const left = "⬅️";
		const right = "➡️";

		msg.channel.send(embed).then((msg) => {
			msg.react(left);
			msg.react(right);

			const interval = 100;
			setInterval(() => {
				msg
					.awaitReactions(
						(reaction, user) =>
							(reaction.emoji.name === left && user.id != msg.author.id) ||
							(reaction.emoji.name === right && user.id != msg.author.id),
						{ time: interval }
					)
					.then(async (collected) => {
						const reaction = collected.first();

						if (reaction.emoji.name === right) {
							const record = await getRecord("+");
							updateRecord(record, msg);
						}
						if (reaction.emoji.name === left) {
							const record = await getRecord("-");
							updateRecord(record, msg);
						}
					})
					.catch((err) => {
						// console.log("no reactions added");
					});
			}, interval);
		});

		async function load() {
			let loadMsg;

			let loadState = [
				"❌❌❌❌ LOADING ",
				"✅❌❌❌ LOADING .",
				"✅✅❌❌ LOADING ..",
				"✅✅✅❌ LOADING ...",
				"✅✅✅✅ LOADING ",
			];

			loadMsg = await msg.channel.send(loadState[0]);

			let i = 0;
			const load = setInterval(() => {
				i++;
				loadMsg.edit(loadState[i]);
				if (i == loadState.length - 1) i = -1;
			}, 1500);
		}
	},
};

function createEmbed(user, date = getDate()) {
	let medals = ["[🥇]", "[🥈]", "[🥉]"];

	const embed = new Discord.MessageEmbed()
		.setColor("#f59342")
		.setTitle("<:steam:852812448313507890>`Steam Rankings				📅" + date + "`");
	//get each user
	let pos = 1;
	for (let i = 0; i < user.length; i++) {
		let name = user[i].name;
		let playtime = user[i].playtime;
		let days = user[i].days;
		let nSpaces = longestString(user) - user[i].name.length;

		var spaces = "           ";
		for (let i = 0; i < nSpaces; i++) {
			spaces += " ";
		}

		let award;
		medals[i] != null ? (award = medals[i]) : (award = "");

		embed.addFields({
			name: `${pos++}.- ${name}${spaces}${award}`, //use emojis to set position in the ranking
			value: `\`${playtime} Hours ⏱️\`\n ${days} Days`,
			inline: false,
		});
	}
	return embed;
}
async function updateRecord(record, msg) {
	let usersId = [];
	let hours = [];
	Object.keys(record).forEach((element) => {
		if (element.startsWith("user_")) {
			let id = element.split("_")[1];
			hours.push(record[element]);

			usersId.push(id);
		}
	});

	let user = [];

	for (let i = 0; i < usersId.length; i++) {
		let days = hours[i] / 24;
		days = days.toFixed(1);

		user.push({
			name: await getNames(usersId[i]),
			playtime: hours[i],
			days: days,
		});
	}

	//sort by playtime
	user.sort((a, b) => parseFloat(b.playtime) - parseFloat(a.playtime));
	console.log(user);
	let embed = createEmbed(user, record.date);
	msg.edit(embed).then(() => {
		msg.reactions.removeAll();

		msg.react("⬅️");
		msg.react("➡️");
	});
}
function getPlaytime(id) {
	return new Promise(function (resolve, reject) {
		steam.getUserOwnedGames(id).then(
			(games) => {
				//hours
				let minutes = 0;
				for (let i = 0; i < games.length; i++) {
					minutes += games[i].playTime;
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

	return (today = `${day}/${month}/${year}`);
}
function longestString(strings) {
	let length = [];

	strings.forEach((element) => {
		length.push(element.name.length);
	});

	return (largestName = Math.max.apply(null, length));
}
