"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_commando_1 = require("discord.js-commando");
const path_1 = __importDefault(require("path"));
const config_json_1 = require("./config.json");
const client = new discord_js_commando_1.CommandoClient({
    commandPrefix: config_json_1.prefix,
    owner: "244134758286753799",
});
client.registry
    .registerDefaultTypes()
    .registerGroups([["steam"], ["other"]])
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerCommandsIn(path_1.default.join(__dirname, "commands"));
client.once("ready", () => {
    var _a, _b, _c;
    console.log(`Logged in as ${(_a = client.user) === null || _a === void 0 ? void 0 : _a.tag}! (${(_b = client.user) === null || _b === void 0 ? void 0 : _b.id})`);
    (_c = client.user) === null || _c === void 0 ? void 0 : _c.setActivity("you from a dark corner", { type: "WATCHING" });
    client.channels.fetch("").then((channel) => {
        channel.send("no");
    });
});
client.on("error", console.error);
client.login(config_json_1.discordToken);
//when a specific user sends a message, react to it with a poop emooji
client.on("message", (msg) => {
    if (msg.author.id === "244517253750456320") {
        msg.react("💩");
    }
});
