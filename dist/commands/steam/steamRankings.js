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
const discord_js_commando_1 = require("discord.js-commando");
//Steam
const SteamAPI = require("steamapi");
const config_json_1 = require("../../config.json");
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
const SteamModel_1 = require("../../database/SteamModel");
function longestString(strings) {
    let length = [];
    strings.forEach((element) => {
        length.push(element.name.length);
    });
    let LongestName;
    return (LongestName = Math.max.apply(null, length));
}
const steamRecord = new SteamModel_1.SteamModel();
module.exports = class SteamRankings extends discord_js_commando_1.Command {
    constructor(client) {
        super(client, {
            name: "steamrankings",
            aliases: ["s"],
            group: "steam",
            memberName: "rankings",
            description: "The Steam playtime rankings",
        });
        this.totalPages = 0;
    }
    run(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            //get names and playtimes
            const user = [];
            for (let id of steamID) {
                //get hoursPlaytime of all the users
                let hours = yield this.getPlaytime(id);
                let days = hours / 24;
                days = parseFloat(days.toFixed(1));
                user.push({
                    id,
                    name: yield this.getName(id),
                    playtime: hours,
                    days: days,
                });
            }
            yield steamRecord.insertNewRecord(user);
            this.totalPages = steamRecord.getLastId();
            //sort by playtime
            user.sort((a, b) => b.playtime - a.playtime);
            let embed = this.createEmbed(user, steamRecord.getLastId());
            return msg.say(embed).then((msg) => {
                const left = "⬅️";
                const right = "➡️";
                const save = "💾";
                msg.react(left);
                msg.react(save);
                const interval = 100;
                setInterval(() => {
                    msg
                        .awaitReactions((reaction, user) => (reaction.emoji.name === left && user.id != msg.author.id) ||
                        (reaction.emoji.name === right && user.id != msg.author.id), { time: interval })
                        .then((collected) => __awaiter(this, void 0, void 0, function* () {
                        const reaction = collected.first();
                        if ((reaction === null || reaction === void 0 ? void 0 : reaction.emoji.name) === right) {
                            const record = yield steamRecord.getRecord("next");
                            this.updateRecord(record, msg);
                        }
                        else if ((reaction === null || reaction === void 0 ? void 0 : reaction.emoji.name) === left) {
                            const record = yield steamRecord.getRecord("previous");
                            this.updateRecord(record, msg);
                        }
                        else if ((reaction === null || reaction === void 0 ? void 0 : reaction.emoji.name) === save) {
                        }
                        else {
                            return;
                        }
                    }))
                        .catch((err) => {
                        // console.log("no reactions added");
                    });
                }, interval);
            });
        });
    }
    createEmbed(user, page, date = this.getDate()) {
        let medals = ["[🥇]", "[🥈]", "[🥉]"];
        const embed = new discord_js_1.MessageEmbed()
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
                name: `${pos++}.- ${name}${award}`,
                value: `\`${playtime} Hours ⏱️\`\n ${days} Days`,
                inline: false,
            });
        }
        return embed;
    }
    updateRecord(record, msg) {
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
            let embed = this.createEmbed(user, steamRecord.getLastId(), record.date);
            msg.edit(embed).then(() => {
                msg.reactions.removeAll();
                if (steamRecord.getLastId() != 1) {
                    msg.react("⬅️");
                }
                if (steamRecord.getLastId() != this.totalPages) {
                    msg.react("➡️");
                }
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
    getDate() {
        let today;
        let date = new Date();
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        return (today = `${day}/${month}/${year}`);
    }
};
