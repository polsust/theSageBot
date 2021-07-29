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
import { SteamModel } from "../../database/SteamModel";
import { SteamUser } from "../../steamUser.interface";

function longestString(strings: any[]) {
	let length: number[] = [];

	strings.forEach((element) => {
		length.push(element.name.length);
	});

	let LongestName: number;
	return (LongestName = Math.max.apply(null, length));
}
const steamRecord = new SteamModel();
module.exports = class SteamRankings extends Command {
	private totalPages: number = 0;

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
		const record: SteamUser[] = [];

		for (let id of steamID) {
			//get hoursPlaytime of all the users
			let hours: any = await this.getPlaytime(id);
			let days: any = hours / 24;
			days = parseFloat(days.toFixed(1));
			record.push({
				id,
				name: await this.getName(id),
				playtime: hours,
				days: days,
			});
		}

		await steamRecord.insertNewRecord(record);
		this.totalPages = steamRecord.getLastId();

		//sort by playtime
		record.sort((a, b) => b.playtime - a.playtime);

		let embed = this.createEmbed(record, steamRecord.getLastId());

		return msg.say(embed).then((msg) => {
			const right = "➡️";
			const left = "⬅️";
			const fastLeft = "⏪";
			const fastRight = "⏩";
			const save = "💾";

			this.addReactions(msg);

			const interval = 100;
			setInterval(() => {
				msg
					.awaitReactions(
						(reaction, user) =>
							(reaction.emoji.name === left && user.id != msg.author.id) ||
							(reaction.emoji.name === right && user.id != msg.author.id) ||
							(reaction.emoji.name === fastLeft && user.id != msg.author.id) ||
							(reaction.emoji.name === fastRight && user.id != msg.author.id) ||
							(reaction.emoji.name === save && user.id != msg.author.id),
						{ time: interval }
					)
					.then(async (collected) => {
						let reaction: MessageReaction | any = collected.first();
						reaction = reaction.emoji.name;
						let record;

						switch (reaction) {
							case right:
								record = await steamRecord.getRecord("next");
								break;
							case left:
								record = await steamRecord.getRecord("previous");
								break;
							case fastRight:
								record = await steamRecord.getRecord("last", this.totalPages);
								break;
							case fastLeft:
								record = await steamRecord.getRecord("first", 1);
								console.log(record);

								break;
							case save:
								break;
							default:
								break;
						}
						this.updateRecord(record, msg);
					})
					.catch((err) => {
						// console.log("no reactions added");
					});
			}, interval);
		});
	}

	private createEmbed(
		user: SteamUser[],
		page: number | any,
		date: string | Date = this.getDate()
	) {
		let medals = ["[🥇]", "[🥈]", "[🥉]"];

		const embed: MessageEmbed = new MessageEmbed()
			.setColor("#f59342")
			.setTitle("<:steam:852812448313507890>`Steam Rankings				📅" + date + "`")
			//display on the footer on wich page we are
			.setFooter(`Page ${page} / ${this.totalPages}`);

		//get each user
		let pos = 1;
		for (let i = 0; i < user.length; i++) {
			let name = user[i].name;
			let playtime = user[i].playtime;
			let days = user[i].days;
			// let nSpaces = 10;

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

		let embed = this.createEmbed(user, steamRecord.getLastId(), record.date);
		msg.edit(embed).then(() => {
			this.addReactions(msg);
		});
	}
	private getPlaytime(id: string): Promise<number> {
		return new Promise((resolve, reject) => {
			steam.getUserOwnedGames(id).then(
				(games: any) => {
					//hours
					let minutes = 0;
					for (let game of games) {
						minutes += game.playTime;
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
	private addReactions(msg: CommandoMessage) {
		msg.reactions.removeAll();

		if (steamRecord.getLastId() != 1) {
			msg.react("⏪");
			msg.react("⬅️");
		}
		msg.react("💾");
		if (steamRecord.getLastId() != this.totalPages) {
			msg.react("➡️");
			msg.react("⏩");
		}
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
