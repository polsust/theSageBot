import { Client } from "discord.js";
import { Message } from "discord.js";
module.exports = {
	commands: ["age", "sageAge", "joined"],
	theClass: class Yee {
		async onInit(msg: Message, client: Client) {
			let today = new Date().getTime();
			let joined = msg.member?.joinedTimestamp;
			let joinedDate = msg.member?.joinedAt;


			if (!joinedDate)return;
			if (!joined) return;

			const joiningDate = joinedDate?.getDate() + "/" + (joinedDate?.getMonth() + 1) + "/" + joinedDate?.getFullYear();


			let serverAge = today - joined;

			let minutes = serverAge / 60000;
			let hours = minutes / 60;
			let days = hours / 24;

			msg.reply(
				`Joined ${days.toFixed(0)} days ago on ${joiningDate}`
			);
		}
	},
};
  