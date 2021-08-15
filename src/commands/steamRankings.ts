import { MessageEmbed, Message } from "discord.js";

import {
	MessageMenuOption,
	MessageMenu,
	MessageButton,
	MessageActionRow,
	MessageComponent,
} from "discord-buttons";
//Steam
const SteamAPI = require("steamapi");

const steam = new SteamAPI(process.env.STEAM_KEY);
const steamID = [
	"76561198298126172", //thePlaya
	"76561198299951692", //george
	"76561198317818722", //ddr
	"76561198295158985", //pol
	"76561198250690454", //jan
	"76561198269871030", //iago
	"76561198325178850", //rul
	"76561198442783501", //mauvy
	"76561199033323069", //marc
];
//DATABASE
import { SteamModel } from "../database/SteamModel";
import { SteamUser } from "../steamUser.interface";
import { Client } from "discord.js";

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
			let loadingMsg = await msg.channel.send("❌❌❌❌");
			this.animateLoading(loadingMsg, 0);

			this.allRecords = await this.steamRecord.getAllRecords();
			this.totalPages = this.allRecords.length;
			this.currentPage = this.totalPages;

			this.allRecords = this.allRecords.sort((a, b) => a.count_id - b.count_id);

			for (const record of this.allRecords) {
				let dateArr = record.date.split("/");

				let date = new Date(
					dateArr[2],
					parseInt(dateArr[1]) - 1,
					parseInt(dateArr[0]) + 1
				);

				record.timeSince = this.getTimeSince(date);

				for (const key in record) {
					if (record[key] === null) {
						delete record[key];
					}
				}
			}

			this.animateLoading(loadingMsg, 1);

			let record = this.allRecords[this.allRecords.length - 1];

			this.preparedRecords = await this.prepareRecords(this.allRecords);
			console.log(this.preparedRecords);

			this.animateLoading(loadingMsg, 2);

			let embed = this.createEmbed(
				this.preparedRecords[this.totalPages - 1],
				this.currentPage,
				record.date,
				record.timeSince
			);

			let row = new MessageActionRow().addComponent(this.createSelect());
			let row2 = new MessageActionRow().addComponents(
				...this.createButtons().set1
			);

			this.animateLoading(loadingMsg, 3);
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
							this.allRecords[index].date,
							this.allRecords[index].timeSince,
							this.createButtons().set1
						);
						menu.reply.defer(true);
					});
					client.on("clickButton", async (button: MessageComponent) => {
						let index: number = 0;
						let setOfButtons: MessageButton[] = this.createButtons().set1;
						let replied = false;

						switch (button.id) {
							case "first":
								index = 0;
								this.currentPage = 1;
								setOfButtons = this.createButtons().set1;
								break;
							case "previous":
								index = this.currentPage - 2;
								this.currentPage--;
								setOfButtons = this.createButtons().set1;
								break;
							case "more":
								index = this.currentPage - 1;
								setOfButtons = this.createButtons().set2;
								break;
							case "new":
								let loadingMsg = await button.reply.send(
									"Adding new record..."
								);
								replied = true;

								let newRecord = await this.addNewRecord(msg);

								this.preparedRecords.push(newRecord[0]);
								let newRecordData = {
									date: this.getDate(),
									count_id: newRecord[1],
								};
								console.log(newRecordData);

								this.allRecords.push(newRecordData);
								this.totalPages++;
								index = this.totalPages - 1;
								this.currentPage = this.totalPages;

								loadingMsg.delete();
								setOfButtons = this.createButtons().set1;
								break;
							case "delete":
								index = this.currentPage - 1;
								setOfButtons = this.createButtons().set3;
								break;
							case "no":
								index = this.currentPage - 1;
								setOfButtons = this.createButtons().set2;
								break;
							case "yes":
								index = this.currentPage - 1;
								console.log(this.allRecords[index]);

								await this.steamRecord
									.deleteRecordById(this.allRecords[index].count_id)
									.catch((err: Error) => {
										msg.channel.send(err);
									});
								this.allRecords.splice(index, 1);
								this.preparedRecords.splice(index, 1);
								this.totalPages--;

								this.currentPage = this.totalPages;
								setOfButtons = this.createButtons().set1;
								break;
							case "goBack":
								index = this.currentPage - 1;
								setOfButtons = this.createButtons().set1;
								break;
							case "next":
								index = this.currentPage;
								this.currentPage++;
								setOfButtons = this.createButtons().set1;
								break;
							case "last":
								index = this.totalPages - 1;
								this.currentPage = this.totalPages;
								setOfButtons = this.createButtons().set1;
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
						console.log(index);
						await this.updateRecord(
							this.preparedRecords[index],
							msg,
							this.allRecords[index].date,
							this.allRecords[index].timeSince,
							setOfButtons
						);

						if (!replied) {
							button.reply.defer(true);
						}
						return;
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
			const count_id = await this.steamRecord
				.insertNewRecord(record)
				.catch((err) => {
					msg.channel.send(err);
				});
			return [record, count_id];
		}
		private animateLoading(msg: Message, index: number) {
			let states = ["✅❌❌❌", "✅✅❌❌", "✅✅✅❌", "✅✅✅✅"];

			msg.edit(states[index]);
		}
		private createSelect(): MessageMenu {
			let selectMenu = new MessageMenu()
				.setID("recordSelect")
				.setPlaceholder("Select a record to display");

			for (let i = 0; i < this.allRecords.length; i++) {
				if (this.allRecords[i] == undefined) break;
				const record = this.allRecords[i];

				i++;
				selectMenu.addOption(
					new MessageMenuOption()
						.setLabel(`${record.date} - ${i}`)
						.setValue(`${i}`)
						.setEmoji("874310019674406953")
				);
				i--;
			}

			return selectMenu;
		}
		private createButtons(): any {
			return {
				set1: [
					new MessageButton()
						.setID("first")
						.setEmoji("874592110693736478")
						.setStyle("blurple")
						.setDisabled(this.currentPage == 1),
					new MessageButton()
						.setID("previous")
						.setEmoji("874592023942922250")
						.setStyle("blurple")
						.setDisabled(this.currentPage == 1),
					new MessageButton()
						.setID("more")
						.setEmoji("874591879050706984")
						.setStyle("green"),
					new MessageButton()
						.setID("next")
						.setEmoji("874591944402173962")
						.setStyle("blurple")
						.setDisabled(this.currentPage == this.totalPages),
					new MessageButton()
						.setID("last")
						.setEmoji("874592072764624938")
						.setStyle("blurple")
						.setDisabled(this.currentPage == this.totalPages),
				],
				set2: [
					new MessageButton()
						.setID("goBack")
						.setEmoji("874593691212341298")
						.setStyle("blurple"),
					new MessageButton()
						.setID("delete")
						.setEmoji("874594197796171776")
						.setStyle("red"),
					new MessageButton()
						.setID("new")
						.setEmoji("874592168000507954")
						.setStyle("green"),
				],
				set3: [
					new MessageButton()
						.setID("no")
						.setEmoji("874592211914866769")
						.setStyle("red"),
					new MessageButton()
						.setID("yes")
						.setEmoji("874592249219022869")
						.setStyle("green"),
				],
			};
		}
		private async prepareRecords(records: any[]) {
			let preparedRecords = [];
			let parsedUsers: any[] = [];

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

					let parsedName: string = "";
					let needToParseName: boolean = true;

					for (const user of parsedUsers) {
						if (usersId[i] == user.id) {
							parsedName = user.name;
							needToParseName = false;
							break;
						}
					}
					if (needToParseName) {
						parsedName = await this.getName(usersId[i]);
					}

					parsedUsers.push({
						id: usersId[i],
						name: parsedName,
					});

					users.push({
						name: parsedName,
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
			date: string | Date,
			timeSince: String
		) {
			let medals = ["[🥇]", "[🥈]", "[🥉]"];
			if (timeSince === undefined) timeSince = "Seconds";

			const embed: MessageEmbed = new MessageEmbed()
				.setColor("#f59342")
				.setTitle(
					`<:steam:852812448313507890>\`Steam Rankings ${timeSince} ago 📅 ${date}  \``
				)
				//display on the footer on witch page we are
				.setFooter(`Page ${page} / ${this.totalPages}`);

			//get each user
			let pos = 1;
			for (let i = 0; i < user.length; i++) {
				let name = user[i].name;
				let playtime: string | number = user[i].playtime;
				let days = user[i].days;

				playtime = playtime.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

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
			date: string | Date,
			timeSince: string,
			setOfButtons: MessageButton[]
		) {
			let embed = this.createEmbed(users, this.currentPage, date, timeSince);

			let row = new MessageActionRow().addComponent(this.createSelect());
			let row2 = new MessageActionRow().addComponents(...setOfButtons);

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
		private getTimeSince(date: Date): string {
			let theDateStamp = date.getTime();
			let todayStamp = new Date().getTime();

			let miliseconds = todayStamp - theDateStamp;

			let minutes = miliseconds / 60000;
			let hours = minutes / 60;
			let days = hours / 24;

			console.log(minutes);

			if (days < 1) {
				return `Less than a day`;
			} else if (days >= 365) {
				let years = days / 365;
				return `${years.toFixed(1)} Years`;
			} else if (days >= 30) {
				let months = days / 30;
				return `${months.toFixed(0)} Months`;
			} else if (days >= 1) {
				return `${days.toFixed(0)} Days`;
			}
			return "ERROR";
		}
	},
};
