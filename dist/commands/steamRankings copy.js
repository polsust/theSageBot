"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const discord_buttons_1 = require("discord-buttons");
//Steam
const SteamAPI = require("steamapi");
const config_json_1 = require("../config.json");
const steam = new SteamAPI(config_json_1.steamToken);
const steamID = [
    "76561198298126172",
    "76561198299951692",
    "76561198317818722",
    "76561198295158985",
    "76561198250690454",
    "76561198269871030",
    "76561198325178850",
    "76561198442783501",
    "76561199033323069", //marc
];
//DATABASE
const SteamModel_1 = require("../database/SteamModel");
/* function longestString(strings: any[]) {
    let length: number[] = [];
    strings.forEach((element) => {
        length.push(element.name.length);
    });
    let LongestName: number;
    return (LongestName = Math.max.apply(null, length));
} */
module.exports = {
    commands: ["steam2", "s2"],
    theClass: class ftrgr {
        constructor() {
            this.totalPages = 0;
            this.allRecords = [];
            this.currentPage = 0;
            this.steamRecord = new SteamModel_1.SteamModel();
        }
        onInit(msg) {
            return __awaiter(this, void 0, void 0, function* () {
                //get names and playtimes
                /* 	const record: SteamUser[] = [];
    
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
            } */
                // await steamRecord.insertNewRecord(record);
                this.allRecords = yield this.steamRecord.getAllRecords();
                this.totalPages = this.allRecords.length;
                this.currentPage = this.totalPages;
                let record = this.allRecords[this.allRecords.length - 1];
                //sort by playtime
                // record.sort((a: { playtime: number; }, b: { playtime: number; }) => b.playtime - a.playtime);
                let users = yield this.prepareRecord(record);
                let embed = this.createEmbed(users, this.currentPage, record.date);
                let row = new discord_buttons_1.MessageActionRow().addComponent(this.createSelect());
                let row2 = new discord_buttons_1.MessageActionRow();
                for (const button of this.createButtons()) {
                    row2.addComponent(button);
                }
                msg.channel
                    .send({
                    content: embed,
                    components: [row, row2],
                })
                    .then((msg) => __awaiter(this, void 0, void 0, function* () {
                    const right = "➡️";
                    const left = "⬅️";
                    const fastLeft = "⏪";
                    const fastRight = "⏩";
                    const save = "💾";
                    const interval = 100;
                    setInterval(() => {
                        msg
                            .awaitReactions((reaction, user) => (reaction.emoji.name === left && user.id != msg.author.id) ||
                            (reaction.emoji.name === right && user.id != msg.author.id) ||
                            (reaction.emoji.name === fastLeft &&
                                user.id != msg.author.id) ||
                            (reaction.emoji.name === fastRight &&
                                user.id != msg.author.id) ||
                            (reaction.emoji.name === save && user.id != msg.author.id), { time: interval })
                            .then((collected) => __awaiter(this, void 0, void 0, function* () {
                            let reaction = collected.first();
                            reaction = reaction.emoji.name;
                            let record;
                            switch (reaction) {
                                case right:
                                    record = this.allRecords[this.currentPage];
                                    this.currentPage++;
                                    break;
                                case left:
                                    record = this.allRecords[this.currentPage - 2];
                                    this.currentPage--;
                                    break;
                                case fastRight:
                                    record = this.allRecords[this.totalPages - 2];
                                    this.currentPage = this.totalPages;
                                    break;
                                case fastLeft:
                                    record = this.allRecords[0];
                                    this.currentPage = 1;
                                    break;
                                case save:
                                    break;
                                default:
                                    break;
                            }
                            let users = yield this.prepareRecord(record);
                            this.updateRecord(users, msg, record.date);
                        }))
                            .catch((err) => {
                            // console.log("no reactions added");
                        });
                    }, interval);
                }));
            });
        }
        createSelect() {
            let selectMenu = new discord_buttons_1.MessageMenu()
                .setID("recordSelect")
                .setPlaceholder("Select a record to display");
            for (let i = 0; i < this.allRecords.length; i++) {
                if (this.allRecords[i] == undefined)
                    break;
                const record = this.allRecords[i];
                selectMenu.addOption(new discord_buttons_1.MessageMenuOption()
                    .setLabel(`${record.date} - ${record.count_id}`)
                    .setValue(`${record.count_id}`)
                    .setDescription(`${record.date} - desc`)
                    .setEmoji("👀"));
            }
            return selectMenu;
        }
        prepareRecord(record) {
            return __awaiter(this, void 0, void 0, function* () {
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
                    days = parseFloat(days.toFixed(1));
                    user.push({
                        name: yield this.getName(usersId[i]),
                        playtime: hours[i],
                        days: days,
                    });
                }
                //sort by playtime
                user.sort((a, b) => b.playtime - a.playtime);
                return user;
            });
        }
        createEmbed(user, page, date = this.getDate()) {
            let medals = ["[🥇]", "[🥈]", "[🥉]"];
            const embed = new discord_js_1.MessageEmbed()
                .setColor("#f59342")
                .setTitle("<:steam:852812448313507890>`Steam Rankings		     		📅" + date + "`")
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
                    name: `${pos++}.- ${name}${award}`,
                    value: `\`${playtime} Hours ⏱️\`\n ${days} Days`,
                    inline: false,
                });
            }
            return embed;
        }
        updateRecord(users, msg, date) {
            return __awaiter(this, void 0, void 0, function* () {
                let embed = this.createEmbed(users, this.currentPage, date);
                msg.edit(embed).then(() => {
                    this.createButtons();
                });
            });
        }
        getPlaytime(id) {
            return new Promise((resolve, reject) => {
                steam.getUserOwnedGames(id).then((games) => {
                    //hours
                    let minutes = 0;
                    for (let game of games) {
                        minutes += game.playTime;
                    }
                    let hours = minutes / 60;
                    hours = Math.round(hours);
                    resolve(hours);
                }, (error) => {
                    reject(error);
                });
            });
        }
        getName(id) {
            return new Promise(function (resolve, reject) {
                steam.getUserSummary(id).then((result) => {
                    resolve(result.nickname);
                }, (error) => {
                    reject(error);
                });
            });
        }
        createButtons() {
            return [
                new discord_buttons_1.MessageButton()
                    .setID("first")
                    .setEmoji("⏮")
                    .setStyle("blurple")
                    .setDisabled(this.currentPage == 1),
                new discord_buttons_1.MessageButton()
                    .setID("previous")
                    .setEmoji("⬅️")
                    .setStyle("blurple")
                    .setDisabled(this.currentPage == 1),
                new discord_buttons_1.MessageButton()
                    .setID("next")
                    .setEmoji("➡️")
                    .setStyle("blurple")
                    .setDisabled(this.currentPage == this.totalPages),
                new discord_buttons_1.MessageButton()
                    .setID("last")
                    .setEmoji("⏩")
                    .setStyle("blurple")
                    .setDisabled(this.currentPage == this.totalPages),
            ];
        }
        getDate() {
            let today;
            let date = new Date();
            let day = date.getDate();
            let month = date.getMonth() + 1;
            let year = date.getFullYear();
            if (month.toString().length == 1) {
                month = "0" + month;
            }
            return (today = `${day}/${month}/${year}`);
        }
    },
};
