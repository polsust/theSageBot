import { MessageReaction, MessageEmbed } from "discord.js";
import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
//Steam
const SteamAPI = require("steamapi");
import { steamToken } from "../../config.json";
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
import { insertNewRecord, getRecord, lastId } from "../../database/Database";
import { SteamUser } from "../../steamUser.interface";

// function longestString(strings: Object[]) {
// 	let length: number[] = [];

// 	strings.forEach((element) => {
// 		length.push(element.name.length);
// 	});

// 	return (largestName = Math.max.apply(null, length));
// }

module.exports = class SteamRankings extends Command {
	constructor(client: CommandoClient) {
		super(client, {
			name: "steamrankings",
			aliases: ["s"],
			group: "steam",
			memberName: "rankings",
			description: "The Steam playtime rankings",
		});
	}

	async run(msg: CommandoMessage): Promise<any> {
		//get names and playtimes
		const user: SteamUser[] = [];
		for (let i = 0; i < steamID.length; i++) {
			const id = steamID[i];
			//get hoursPlaytime of all the users
			let hours: any = await this.getPlaytime(id);
			let days: any = hours / 24;
			days = parseFloat(days.toFixed(1));
			user.push({
				id,
				name: await this.getName(id),
				playtime: hours,
				days: days,
			});
		}
		insertNewRecord(user);

		//sort by playtime
		user.sort((a, b) => b.playtime - a.playtime);

		let embed = this.createEmbed(user, lastId());

		return msg.say(embed).then((msg) => {
			const left = "⬅️";
			const right = "➡️";

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
						const reaction: MessageReaction | undefined = collected.first();

						if (reaction?.emoji.name === right) {
							const record = await getRecord("+");
							this.updateRecord(record, msg);
						} else if (reaction?.emoji.name === left) {
							const record = await getRecord("-");
							this.updateRecord(record, msg);
						} else {
							return;
						}
					})
					.catch((err) => {
						// console.log("no reactions added");
					});
			}, interval);
		});
	}

	private createEmbed(
		user: SteamUser[],
		totalPages: number | any,
		date: string | Date = this.getDate()
	) {
		let medals = ["[🥇]", "[🥈]", "[🥉]"];

		const embed: MessageEmbed = new MessageEmbed()
			.setColor("#f59342")
			.setTitle("<:steam:852812448313507890>`Steam Rankings				📅" + date + "`")
			//display on the footer on wich page we are
			.setFooter(`Page x / ${totalPages}`);

		//get each user
		let pos = 1;
		for (let i = 0; i < user.length; i++) {
			let name = user[i].name;
			let playtime = user[i].playtime;
			let days = user[i].days;
			// let nSpaces = longestString(user.name) - user[i].name.length;

			// var spaces = "           ";
			// for (let i = 0; i < nSpaces; i++) {
			// 	spaces += " ";
			// }

			let award;
			medals[i] != null ? (award = medals[i]) : (award = "");

			embed.addFields({
				name: `${pos++}.- ${name}${award}`, //use emojis to set position in the ranking
				value: `\`${playtime} Hours ⏱️\`\n ${days} Days`,
				inline: false,
			});
		}

		return embed;
	}
	private async updateRecord(record: any, msg: CommandoMessage) {
		let usersId: string[] = [];
		let hours: any[] = [];

		Object.keys(record).forEach((element) => {
			if (element.startsWith("user_")) {
				let id = element.split("_")[1];
				hours.push(record[element]);

				usersId.push(id);
			}
		});

		let user: SteamUser[] = [];

		for (let i = 0; i < usersId.length; i++) {
			let days: number = hours[i] / 24;
			days = parseFloat(days.toFixed(1));

			user.push({
				name: await this.getName(usersId[i]),
				playtime: hours[i],
				days: days,
			});
		}

		//sort by playtime
		user.sort((a, b) => b.playtime - a.playtime);

		let embed = this.createEmbed(user, lastId(), record.date);
		msg.edit(embed).then(() => {
			msg.reactions.removeAll();

			msg.react("⬅️");
			msg.react("➡️");
		});
	}
	private getPlaytime(id: string): Promise<number> {
		return new Promise((resolve, reject) => {
			steam.getUserOwnedGames(id).then(
				(games: any) => {
					//hours
					let minutes = 0;
					for (let i = 0; i < games.length; i++) {
						minutes += games[i].playTime;
					}
					let hours = minutes / 60;
					hours = Math.round(hours);

					resolve(hours);
				},
				(error: string) => {
					reject(error);
				}
			);
		});
	}
	private getName(id: String | Number): Promise<string> {
		return new Promise(function (resolve, reject) {
			steam.getUserSummary(id).then(
				(result: { nickname: string | PromiseLike<string> }) => {
					resolve(result.nickname);
				},
				(error: string) => {
					reject(error);
				}
			);
		});
	}

	private getDate() {
		let today: string;

		let date = new Date();
		let day = date.getDate();
		let month = date.getMonth() + 1;
		let year = date.getFullYear();

		return (today = `${day}/${month}/${year}`);
	}
};
