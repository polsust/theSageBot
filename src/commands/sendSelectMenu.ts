import { Message } from "discord.js";

import { MessageMenu, MessageMenuOption } from "discord-buttons";

module.exports = {
	commands: ["sendSelectMenu", "sel"],
	theClass: class SelectMenu {
		onInit(msg: Message) {
			let option = new MessageMenuOption()
				.setLabel("Your Label")
				.setEmoji("🍔")
				.setValue("menuid")
				.setDescription("Custom Description!");

			let select = new MessageMenu()
				.setID("customid")
				.setPlaceholder("Click me! :D")
				.setMaxValues(1)
				.setMinValues(1)
				.addOption(option);

			msg.channel.send("Text with menu!", select);
		}
	},
};
