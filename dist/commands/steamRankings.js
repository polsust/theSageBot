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
const steam = new SteamAPI(process.env.STEAM_KEY);
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
                let loadingMsg = yield msg.channel.send("❌❌❌❌");
                this.animateLoading(loadingMsg, 0);
                this.allRecords = yield this.steamRecord.getAllRecords();
                this.totalPages = this.allRecords.length;
                this.currentPage = this.totalPages;
                this.allRecords = this.allRecords.sort((a, b) => a.count_id - b.count_id);
                for (const record of this.allRecords) {
                    let dateArr = record.date.split("/");
                    let date = new Date(dateArr[2], parseInt(dateArr[1]) - 1, parseInt(dateArr[0]) + 1);
                    record.timeSince = this.getTimeSince(date);
                    for (const key in record) {
                        if (record[key] === null) {
                            delete record[key];
                        }
                    }
                }
                this.animateLoading(loadingMsg, 1);
                let record = this.allRecords[this.allRecords.length - 1];
                this.preparedRecords = yield this.prepareRecords(this.allRecords);
                console.log(this.preparedRecords);
                this.animateLoading(loadingMsg, 2);
                let embed = this.createEmbed(this.preparedRecords[this.totalPages - 1], this.currentPage, record.date, record.timeSince);
                let row = new discord_buttons_1.MessageActionRow().addComponent(this.createSelect());
                let row2 = new discord_buttons_1.MessageActionRow().addComponents(...this.createButtons().set1);
                this.animateLoading(loadingMsg, 3);
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
                        yield this.updateRecord(this.preparedRecords[index], msg, this.allRecords[index].date, this.allRecords[index].timeSince, this.createButtons().set1);
                        menu.reply.defer(true);
                    }));
                    client.on("clickButton", (button) => __awaiter(this, void 0, void 0, function* () {
                        let index = 0;
                        let setOfButtons = this.createButtons().set1;
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
                                let loadingMsg = yield button.reply.send("Adding new record...");
                                replied = true;
                                let newRecord = yield this.addNewRecord(msg);
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
                                yield this.steamRecord
                                    .deleteRecordById(this.allRecords[index].count_id)
                                    .catch((err) => {
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
                        console.log(index);
                        yield this.updateRecord(this.preparedRecords[index], msg, this.allRecords[index].date, this.allRecords[index].timeSince, setOfButtons);
                        if (!replied) {
                            button.reply.defer(true);
                        }
                        return;
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
                const count_id = yield this.steamRecord
                    .insertNewRecord(record)
                    .catch((err) => {
                    msg.channel.send(err);
                });
                return [record, count_id];
            });
        }
        animateLoading(msg, index) {
            let states = ["✅❌❌❌", "✅✅❌❌", "✅✅✅❌", "✅✅✅✅"];
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
                i++;
                selectMenu.addOption(new discord_buttons_1.MessageMenuOption()
                    .setLabel(`${record.date} - ${i}`)
                    .setValue(`${i}`)
                    .setEmoji("874310019674406953"));
                i--;
            }
            return selectMenu;
        }
        createButtons() {
            return {
                set1: [
                    new discord_buttons_1.MessageButton()
                        .setID("first")
                        .setEmoji("874592110693736478")
                        .setStyle("blurple")
                        .setDisabled(this.currentPage == 1),
                    new discord_buttons_1.MessageButton()
                        .setID("previous")
                        .setEmoji("874592023942922250")
                        .setStyle("blurple")
                        .setDisabled(this.currentPage == 1),
                    new discord_buttons_1.MessageButton()
                        .setID("more")
                        .setEmoji("874591879050706984")
                        .setStyle("green"),
                    new discord_buttons_1.MessageButton()
                        .setID("next")
                        .setEmoji("874591944402173962")
                        .setStyle("blurple")
                        .setDisabled(this.currentPage == this.totalPages),
                    new discord_buttons_1.MessageButton()
                        .setID("last")
                        .setEmoji("874592072764624938")
                        .setStyle("blurple")
                        .setDisabled(this.currentPage == this.totalPages),
                ],
                set2: [
                    new discord_buttons_1.MessageButton()
                        .setID("goBack")
                        .setEmoji("874593691212341298")
                        .setStyle("blurple"),
                    new discord_buttons_1.MessageButton()
                        .setID("delete")
                        .setEmoji("874594197796171776")
                        .setStyle("red"),
                    new discord_buttons_1.MessageButton()
                        .setID("new")
                        .setEmoji("874592168000507954")
                        .setStyle("green"),
                ],
                set3: [
                    new discord_buttons_1.MessageButton()
                        .setID("no")
                        .setEmoji("874592211914866769")
                        .setStyle("red"),
                    new discord_buttons_1.MessageButton()
                        .setID("yes")
                        .setEmoji("874592249219022869")
                        .setStyle("green"),
                ],
            };
        }
        prepareRecords(records) {
            return __awaiter(this, void 0, void 0, function* () {
                let preparedRecords = [];
                let parsedUsers = [];
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
                        let parsedName = "";
                        let needToParseName = true;
                        for (const user of parsedUsers) {
                            if (usersId[i] == user.id) {
                                parsedName = user.name;
                                needToParseName = false;
                                break;
                            }
                        }
                        if (needToParseName) {
                            parsedName = yield this.getName(usersId[i]);
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
            });
        }
        createEmbed(user, page, date, timeSince) {
            let medals = ["[🥇]", "[🥈]", "[🥉]"];
            if (timeSince === undefined)
                timeSince = "Seconds";
            const embed = new discord_js_1.MessageEmbed()
                .setColor("#f59342")
                .setTitle(`<:steam:852812448313507890>\`Steam Rankings ${timeSince} ago 📅 ${date}  \``)
                //display on the footer on witch page we are
                .setFooter(`Page ${page} / ${this.totalPages}`);
            //get each user
            let pos = 1;
            for (let i = 0; i < user.length; i++) {
                let name = user[i].name;
                let playtime = user[i].playtime;
                let days = user[i].days;
                playtime = playtime.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
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
        updateRecord(users, msg, date, timeSince, setOfButtons) {
            return __awaiter(this, void 0, void 0, function* () {
                let embed = this.createEmbed(users, this.currentPage, date, timeSince);
                let row = new discord_buttons_1.MessageActionRow().addComponent(this.createSelect());
                let row2 = new discord_buttons_1.MessageActionRow().addComponents(...setOfButtons);
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
        getTimeSince(date) {
            let theDateStamp = date.getTime();
            let todayStamp = new Date().getTime();
            let miliseconds = todayStamp - theDateStamp;
            let minutes = miliseconds / 60000;
            let hours = minutes / 60;
            let days = hours / 24;
            console.log(minutes);
            if (days < 1) {
                return `Less than a day`;
            }
            else if (days >= 365) {
                let years = days / 365;
                return `${years.toFixed(1)} Years`;
            }
            else if (days >= 30) {
                let months = days / 30;
                return `${months.toFixed(0)} Months`;
            }
            else if (days >= 1) {
                return `${days.toFixed(0)} Days`;
            }
            return "ERROR";
        }
    },
};
