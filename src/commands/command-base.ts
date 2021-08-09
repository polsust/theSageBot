import { Client } from "discord.js";
import { Message } from "discord.js";
import { prefix } from "../config.json";

export = (client: Client, commandOptions: any) => {
	let { commands, theClass } = commandOptions;

	client.on("message", (msg: Message) => {
		const { member, content } = msg;

		if (commands === undefined || commands === {}) return;
		if (!content.startsWith(prefix)) return;

		for (const command of commands) {
			if (content.toLowerCase() === `${prefix}${command.toLowerCase()}`) {
				new theClass().onInit(msg, client);

				return;
			}
		}
	});
};
