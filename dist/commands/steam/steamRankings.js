"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const discord_buttons_1 = __importStar(require("discord-buttons"));
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
/* function longestString(strings: any[]) {
    
    let length: number[] = [];

    strings.forEach((element) => {
        length.push(element.name.length);
    });

    let LongestName: number;
    return (LongestName = Math.max.apply(null, length));
} */
const steamRecord = new SteamModel_1.SteamModel();
const client = new discord_js_1.Client();
discord_buttons_1.default(client);
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
            const record = [];
            for (let id of steamID) {
                //get hoursPlaytime of all the users
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
            yield steamRecord.insertNewRecord(record);
            this.totalPages = steamRecord.getLastId();
            //sort by playtime
            record.sort((a, b) => b.playtime - a.playtime);
            let embed = this.createEmbed(record, steamRecord.getLastId());
            let allRecords = yield steamRecord.getAllRecords();
            let selectMenu = new discord_buttons_1.MessageMenu()
                .setID("recordSelect")
                .setPlaceholder("Select a record to display");
            // console.log(allRecords);
            for (let i = 0; i < allRecords.length; i++) {
                if (allRecords[i] == undefined)
                    break;
                const record = allRecords[i];
                selectMenu.addOption(new discord_buttons_1.MessageMenuOption()
                    .setLabel(`${record.date} - ${record.count_id}`)
                    .setValue(`${record.count_id}`)
                    .setDescription(`${record.date} - desc`)
                    .setEmoji("👀"));
            }
            msg.channel.send("Select a Record : ", selectMenu);
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
                        .awaitReactions((reaction, user) => (reaction.emoji.name === left && user.id != msg.author.id) ||
                        (reaction.emoji.name === right && user.id != msg.author.id) ||
                        (reaction.emoji.name === fastLeft && user.id != msg.author.id) ||
                        (reaction.emoji.name === fastRight && user.id != msg.author.id) ||
                        (reaction.emoji.name === save && user.id != msg.author.id), { time: interval })
                        .then((collected) => __awaiter(this, void 0, void 0, function* () {
                        let reaction = collected.first();
                        reaction = reaction.emoji.name;
                        let record;
                        switch (reaction) {
                            case right:
                                record = yield steamRecord.getRecord("next");
                                break;
                            case left:
                                record = yield steamRecord.getRecord("previous");
                                break;
                            case fastRight:
                                record = yield steamRecord.getRecord("last", this.totalPages);
                                break;
                            case fastLeft:
                                record = yield steamRecord.getRecord("first", 1);
                                console.log(record);
                                break;
                            case save:
                                break;
                            default:
                                break;
                        }
                        this.updateRecord(record, msg);
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
                this.addReactions(msg);
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
    addReactions(msg) {
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
    getDate() {
        let today;
        let date = new Date();
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        return (today = `${day}/${month}/${year}`);
    }
};
