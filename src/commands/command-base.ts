import path from "path";
import { Client, Message } from "discord.js";

const prefix = require(path.join(__dirname, "../../config.json")).prefix;

export = (client: Client, commandOptions: any) => {
	let { commands, theClass } = commandOptions;

	client.on("message", (msg: Message) => {
		const { member, content } = msg;

		let segmentedMsg = content.split(" ");

		const msgContent = segmentedMsg[0];
		segmentedMsg.splice(0, 1);

		const msgArgs = segmentedMsg;

		if (commands === undefined || commands === {}) return;
		if (!content.startsWith(prefix)) return;

		for (const command of commands) {
			if (msgContent.toLowerCase() === `${prefix}${command.toLowerCase()}`) {
				new theClass().onInit(msg, client, msgArgs);

				return;
			}
		}
	});
};
