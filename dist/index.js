"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const config_json_1 = require("./config.json");
const client = new discord_js_1.Client();
const disbut = require("discord-buttons");
disbut(client);
client.once("ready", () => {
    var _a, _b;
    //commands
    console.log(((_a = client.user) === null || _a === void 0 ? void 0 : _a.username) + " is ready!");
    (_b = client.user) === null || _b === void 0 ? void 0 : _b.setActivity("https://www.youtube.com/watch?v=dQw4w9WgXcQ", {
        type: "WATCHING",
    });
    const baseFile = "command-base.js";
    const commandBase = require(`./commands/${baseFile}`);
    const readCommands = (dir) => {
        const files = fs_1.default.readdirSync(path_1.default.join(__dirname, dir));
        for (const file of files) {
            const stat = fs_1.default.lstatSync(path_1.default.join(__dirname, dir, file));
            if (stat.isDirectory()) {
                readCommands(path_1.default.join(dir, file));
            }
            else if (file != baseFile) {
                const option = require(path_1.default.join(__dirname, dir, file));
                commandBase(client, option);
            }
        }
    };
    readCommands("commands");
});
//events
process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});
client.on("disconnect", () => {
    var _a;
    (_a = client.user) === null || _a === void 0 ? void 0 : _a.setActivity("Disconnected");
});
client.on("typingStart", (channel, user) => {
    console.log(`${user.username} is typing in ${channel.name}`);
});
// client.on("clickButton", (b: MessageComponent) => {
// 	console.log(b.id);
// });
client.login(config_json_1.discordToken);
