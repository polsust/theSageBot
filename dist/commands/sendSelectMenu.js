"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_buttons_1 = require("discord-buttons");
module.exports = {
    commands: ["sendSelectMenu", "sel"],
    theClass: class SelectMenu {
        onInit(msg) {
            let option = new discord_buttons_1.MessageMenuOption()
                .setLabel("Your Label")
                .setEmoji("🍔")
                .setValue("menuid")
                .setDescription("Custom Description!");
            let select = new discord_buttons_1.MessageMenu()
                .setID("customid")
                .setPlaceholder("Click me! :D")
                .setMaxValues(1)
                .setMinValues(1)
                .addOption(option);
            msg.channel.send("Text with menu!", select);
        }
    },
};
