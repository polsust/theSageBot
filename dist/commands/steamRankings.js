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
    commands: ["steamRankings", "s", "steamRanking", "sr", "rankings"],
    theClass: class SteamRankings {
        constructor() {
            this.totalPages = 0;
            this.allRecords = [];
            this.preparedRecords = [];
            this.currentPage = 0;
            this.steamRecord = new SteamModel_1.SteamModel();
        }
        onInit(msg, client) {
            return __awaiter(this, void 0, void 0, function* () {
                let loadingMsg = yield msg.channel.send("❌❌❌❌❌");
                this.animateLoading(loadingMsg, 0);
                this.allRecords = yield this.steamRecord.getAllRecords();
                this.totalPages = this.allRecords.length;
                this.currentPage = this.totalPages;
                this.animateLoading(loadingMsg, 1);
                let record = this.allRecords[this.allRecords.length - 1];
                this.preparedRecords = yield this.prepareRecords(this.allRecords);
                console.log(this.preparedRecords);
                this.animateLoading(loadingMsg, 2);
                let embed = this.createEmbed(this.preparedRecords[this.totalPages - 1], this.currentPage, record.date);
                this.animateLoading(loadingMsg, 3);
                let row = new discord_buttons_1.MessageActionRow().addComponent(this.createSelect());
                let row2 = new discord_buttons_1.MessageActionRow().addComponents(...this.createButtons());
                this.animateLoading(loadingMsg, 4);
                yield loadingMsg.delete();
                msg.channel
                    .send({
                    embed: embed,
                    components: [row, row2],
                })
                    .then((msg) => __awaiter(this, void 0, void 0, function* () {
                    client.on("clickMenu", (menu) => __awaiter(this, void 0, void 0, function* () {
                        if (menu.values === undefined)
                            return;
                        let index = parseInt(menu.values[0]);
                        this.currentPage = index;
                        index--;
                        yield this.updateRecord(this.preparedRecords[index], msg, this.allRecords[index].date);
                        menu.reply.defer(true);
                    }));
                    client.on("clickButton", (button) => __awaiter(this, void 0, void 0, function* () {
                        console.log(button.id);
                        let index = 0;
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
                                let newRecord = yield this.addNewRecord(msg);
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
                        }
                        else if (index > this.totalPages - 1) {
                            index = this.totalPages - 1;
                        }
                        if (this.currentPage < 1) {
                            this.currentPage = 1;
                        }
                        else if (this.currentPage > this.totalPages) {
                            this.currentPage = this.totalPages;
                        }
                        yield this.updateRecord(this.preparedRecords[index], msg, this.allRecords[index].date);
                        button.reply.defer(true);
                    }));
                }));
            });
        }
        addNewRecord(msg) {
            return __awaiter(this, void 0, void 0, function* () {
                // get names and playtimes
                const record = [];
                for (const id of steamID) {
                    // get hoursPlaytime of all the users
                    let hours = yield this.getPlaytime(id);
                    let days = hours / 24;
                    days = parseFloat(days.toFixed(1));
                    record.push({
                        id,
                        name: yield this.getName(id),
                        playtime: hours,
                        days: days,
                    });
                }
                // sort by playtime
                record.sort((a, b) => b.playtime - a.playtime);
                yield this.steamRecord.insertNewRecord(record).catch((err) => {
                    msg.channel.send(err);
                });
                return record;
            });
        }
        animateLoading(msg, index) {
            let states = [
                "✅❌❌❌❌",
                "✅✅❌❌❌",
                "✅✅✅❌❌",
                "✅✅✅✅❌",
                "✅✅✅✅✅",
            ];
            msg.edit(states[index]);
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
                    .setEmoji("874310019674406953"));
            }
            return selectMenu;
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
                new discord_buttons_1.MessageButton().setID("new").setEmoji("➕").setStyle("green"),
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
        prepareRecords(records) {
            return __awaiter(this, void 0, void 0, function* () {
                console.log(records);
                let preparedRecords = [];
                for (const record of records) {
                    let usersId = [];
                    let hours = [];
                    Object.keys(record).forEach((element) => {
                        if (element.startsWith("user_")) {
                            let id = element.split("_")[1];
                            hours.push(record[element]);
                            usersId.push(id);
                        }
                    });
                    let users = [];
                    for (let i = 0; i < usersId.length; i++) {
                        let days = hours[i] / 24;
                        days = parseFloat(days.toFixed(1));
                        users.push({
                            name: yield this.getName(usersId[i]),
                            playtime: hours[i],
                            days: days,
                        });
                    }
                    //sort by playtime
                    users.sort((a, b) => b.playtime - a.playtime);
                    preparedRecords.push(users);
                }
                return preparedRecords;
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
                let row = new discord_buttons_1.MessageActionRow().addComponent(this.createSelect());
                let row2 = new discord_buttons_1.MessageActionRow().addComponents(...this.createButtons());
                yield msg.edit({ content: embed, components: [row, row2] });
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
            return new Promise((resolve, reject) => {
                steam.getUserSummary(id).then((result) => {
                    resolve(result.nickname);
                }, (error) => {
                    reject(error);
                });
            });
        }
        getDate() {
            let today;
            let date = new Date();
            let day = date.getDate();
            let month = date.getMonth() + 1;
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
