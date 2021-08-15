"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const path_1 = __importDefault(require("path"));
const prefix = require(path_1.default.join(__dirname, "../config.json")).prefix;
module.exports = (client, commandOptions) => {
    let { commands, theClass } = commandOptions;
    client.on("message", (msg) => {
        const { member, content } = msg;
        if (commands === undefined || commands === {})
            return;
        if (!content.startsWith(prefix))
            return;
        for (const command of commands) {
            if (content.toLowerCase() === `${prefix}${command.toLowerCase()}`) {
                new theClass().onInit(msg, client);
                return;
            }
        }
    });
};
