import { VoiceState } from "discord.js";
import { Client } from "discord.js";
import { Message } from "discord.js";
module.exports = {
	commands: ["yee"],
	theClass: class Yee {
		async onInit(msg: Message, client: Client) {
			let voice = msg.member?.voice;

			if (!voice?.channelID) {
				msg.reply("You must be in a voice channel to use this command.");
				return;
			}

			let connection = await voice.channel?.join();
			connection?.play("./src/assets/audio/yee.mp3");
		}
	},
};
