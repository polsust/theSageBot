import { MessageReaction, MessageEmbed, Message } from "discord.js";

import {
	MessageMenuOption,
	MessageMenu,
	MessageButton,
	MessageActionRow,
	MessageComponent,
} from "discord-buttons";
//Steam
const SteamAPI = require("steamapi");
import { steamToken } from "../config.json";
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
import { SteamModel } from "../database/SteamModel";
import { SteamUser } from "../steamUser.interface";
import { Client } from "discord.js";

/* function longestString(strings: any[]) {
	let length: number[] = [];
	strings.forEach((element) => {
		length.push(element.name.length);
	});
	let LongestName: number;
	return (LongestName = Math.max.apply(null, length));
} */

module.exports = {
	commands: ["steamRankings", "s", "steamRanking", "sr", "rankings"],
	theClass: class SteamRankings {
		private totalPages: number = 0;
		private allRecords: any[] = [];
		private preparedRecords: any[] = [];

		private currentPage: number = 0;
		private steamRecord: SteamModel;
		constructor() {
			this.steamRecord = new SteamModel();
		}

		async onInit(msg: Message, client: Client) {
			let loadingMsg = await msg.channel.send("❌❌❌❌❌");
			this.animateLoading(loadingMsg, 0);

			this.allRecords = await this.steamRecord.getAllRecords();
			this.totalPages = this.allRecords.length;
			this.currentPage = this.totalPages;

			this.animateLoading(loadingMsg, 1);

			let record = this.allRecords[this.allRecords.length - 1];

			this.preparedRecords = await this.prepareRecords(this.allRecords);
			console.log(this.preparedRecords);

			this.animateLoading(loadingMsg, 2);

			let embed = this.createEmbed(
				this.preparedRecords[this.totalPages - 1],
				this.currentPage,
				record.date
			);
			this.animateLoading(loadingMsg, 3);

			let row = new MessageActionRow().addComponent(this.createSelect());
			let row2 = new MessageActionRow().addComponents(...this.createButtons());

			this.animateLoading(loadingMsg, 4);
			await loadingMsg.delete();
			msg.channel
				.send({
					embed: embed,
					components: [row, row2],
				})
				.then(async (msg: Message | Message[] | any) => {
					client.on("clickMenu", async (menu: MessageComponent) => {
						if (menu.values === undefined) return;

						let index = parseInt(menu.values[0]);
						this.currentPage = index;
						index--;

						await this.updateRecord(
							this.preparedRecords[index],
							msg,
							this.allRecords[index].date
						);
						menu.reply.defer(true);
					});
					client.on("clickButton", async (button: MessageComponent) => {
						console.log(button.id);
						let index: number = 0;

						switch (button.id) {
							case "first":
								index = 0;
								this.currentPage = 1;
								break;
							case "previous":
								index = this.currentPage - 2;
								this.currentPage--;
								break;
							case "new":
								let newRecord = await this.addNewRecord(msg);
								this.preparedRecords.push(newRecord);

								let count_id = this.totalPages + 1;
								let newRecordData = {
									date: this.getDate(),
									count_id,
								};
								this.allRecords.push(newRecordData);

								index = this.totalPages - 1;
								this.currentPage = this.totalPages;
								break;
							case "next":
								index = this.currentPage;
								this.currentPage++;
								break;
							case "last":
								index = this.totalPages - 1;
								this.currentPage = this.totalPages;
								break;
						}

						if (index < 0) {
							index = 0;
						} else if (index > this.totalPages - 1) {
							index = this.totalPages - 1;
						}
						if (this.currentPage < 1) {
							this.currentPage = 1;
						} else if (this.currentPage > this.totalPages) {
							this.currentPage = this.totalPages;
						}

						await this.updateRecord(
							this.preparedRecords[index],
							msg,
							this.allRecords[index].date
						);
						button.reply.defer(true);
					});
				});
		}
		private async addNewRecord(msg: Message) {
			// get names and playtimes
			const record: SteamUser[] = [];

			for (const id of steamID) {
				// get hoursPlaytime of all the users
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
			// sort by playtime
			record.sort(
				(a: { playtime: number }, b: { playtime: number }) =>
					b.playtime - a.playtime
			);
			await this.steamRecord.insertNewRecord(record).catch((err) => {
				msg.channel.send(err);
			});
			return record;
		}
		private animateLoading(msg: Message, index: number) {
			let states = [
				"✅❌❌❌❌",
				"✅✅❌❌❌",
				"✅✅✅❌❌",
				"✅✅✅✅❌",
				"✅✅✅✅✅",
			];

			msg.edit(states[index]);
		}
		private createSelect(): MessageMenu {
			let selectMenu = new MessageMenu()
				.setID("recordSelect")
				.setPlaceholder("Select a record to display");

			for (let i = 0; i < this.allRecords.length; i++) {
				if (this.allRecords[i] == undefined) break;
				const record = this.allRecords[i];

				selectMenu.addOption(
					new MessageMenuOption()
						.setLabel(`${record.date} - ${record.count_id}`)
						.setValue(`${record.count_id}`)
						.setDescription(`${record.date} - desc`)
						.setEmoji("874310019674406953")
				);
			}

			return selectMenu;
		}
		private createButtons(): MessageButton[] {
			return [
				new MessageButton()
					.setID("first")
					.setEmoji("⏮")
					.setStyle("blurple")
					.setDisabled(this.currentPage == 1),
				new MessageButton()
					.setID("previous")
					.setEmoji("⬅️")
					.setStyle("blurple")
					.setDisabled(this.currentPage == 1),
				new MessageButton().setID("new").setEmoji("➕").setStyle("green"),
				new MessageButton()
					.setID("next")
					.setEmoji("➡️")
					.setStyle("blurple")
					.setDisabled(this.currentPage == this.totalPages),
				new MessageButton()
					.setID("last")
					.setEmoji("⏩")
					.setStyle("blurple")
					.setDisabled(this.currentPage == this.totalPages),
			];
		}
		private async prepareRecords(records: any[]) {
			console.log(records);

			let preparedRecords = [];
			for (const record of records) {
				let usersId: string[] = [];
				let hours: any[] = [];

				Object.keys(record).forEach((element) => {
					if (element.startsWith("user_")) {
						let id = element.split("_")[1];
						hours.push(record[element]);

						usersId.push(id);
					}
				});

				let users: SteamUser[] = [];

				for (let i = 0; i < usersId.length; i++) {
					let days: number = hours[i] / 24;
					days = parseFloat(days.toFixed(1));

					users.push({
						name: await this.getName(usersId[i]),
						playtime: hours[i],
						days: days,
					});
				}

				//sort by playtime
				users.sort((a, b) => b.playtime - a.playtime);

				preparedRecords.push(users);
			}

			return preparedRecords;
		}
		private createEmbed(
			user: SteamUser[],
			page: number | any,
			date: string | Date = this.getDate()
		) {
			let medals = ["[🥇]", "[🥈]", "[🥉]"];

			const embed: MessageEmbed = new MessageEmbed()
				.setColor("#f59342")
				.setTitle(
					"<:steam:852812448313507890>`Steam Rankings		     		📅" + date + "`"
				)
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
		private async updateRecord(
			users: SteamUser[],
			msg: any,
			date: string | Date
		) {
			let embed = this.createEmbed(users, this.currentPage, date);

			let row = new MessageActionRow().addComponent(this.createSelect());
			let row2 = new MessageActionRow().addComponents(...this.createButtons());

			await msg.edit({ content: embed, components: [row, row2] });
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
			return new Promise((resolve, reject) => {
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
			let day: number | string = date.getDate();
			let month: number | string = date.getMonth() + 1;
			let year = date.getFullYear();

			if (day.toString().length == 1) {
				day = "0" + day;
			}
			if (month.toString().length == 1) {
				month = "0" + month;
			}

			return (today = `${day}/${month}/${year}`);
		}
	},
};
