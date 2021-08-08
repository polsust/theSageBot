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
client.once("ready", () => {
    var _a;
    console.log(((_a = client.user) === null || _a === void 0 ? void 0 : _a.username) + " is ready!");
    const baseFile = "command-base.js";
    const commandBase = require(`./commands/${baseFile}`);
    const readCommands = (dir) => {
        // console.log(path.join(__dirname, dir));
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
client.login(config_json_1.discordToken);
