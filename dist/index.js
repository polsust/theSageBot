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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_commando_1 = require("discord.js-commando");
const path_1 = __importDefault(require("path"));
const config_json_1 = require("./config.json");
const discord_menus_1 = require("discord-menus");
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
    // client.user?.setActivity("you from a dark corner", { type: "WATCHING" });
    (_c = client.user) === null || _c === void 0 ? void 0 : _c.setStatus("idle");
});
client.on("error", console.error);
client.login(config_json_1.discordToken);
const MenusManager = new discord_menus_1.DiscordMenus(client);
client.on("message", (msg) => __awaiter(void 0, void 0, void 0, function* () {
    if (msg.author.id === "244517253750456320") {
        // msg.react("💩");
    }
    /* 	const menu = new MessageMenuOptions()
        .addLabel("Value 1", {
            description: "This the value 1 description",
            value: "value-1",
        })
        .setMaxValues(3)
        .setMinValues(1)
        .setCustomID("cool-custom-id")
        .setPlaceHolder("Select an option");

    await MenusManager.sendMenu(msg, "content", { menu }).catch((err) => {
        console.error(err);
    }); */
}));
//give a member a role to all new users
client.on("guildMemberAdd", (member) => {
    if (member.guild.id === "244135020401393665") {
        member.roles.add("244517253750456320").catch(console.error);
    }
});
client.on("disconnect", () => {
    var _a;
    (_a = client.user) === null || _a === void 0 ? void 0 : _a.setActivity("offline");
});
