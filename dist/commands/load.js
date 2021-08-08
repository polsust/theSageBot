"use strict";
// module.exports = {
// 	name: "l",
// 	async execute(msg, args) {
// 		var mymsg;
// 		var loadState = [
// 			"❌❌❌❌ LOADING ",
// 			"✅❌❌❌ LOADING .",
// 			"✅✅❌❌ LOADING ..",
// 			"✅✅✅❌ LOADING ...",
// 			"✅✅✅✅ LOADING ",
// 		];
// 		mymsg = await msg.channel.send(loadState[0]);
// 		var i = 0;
// 		var load = setInterval(() => {
// 			i++;
// 			mymsg.edit(loadState[i]);
// 			if (i == loadState.length - 1) i = -1;
// 		}, 1500);
// 	},
// };
// import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
// module.exports = class Poop extends Command {
// 	constructor(client: CommandoClient) {
// 		super(client, {
// 			name: "load",
// 			aliases: ["l"],
// 			group: "other",
// 			memberName: "loader",
// 			description: "loading bar",
// 		});
// 	}
// 	run(msg: CommandoMessage): Promise<CommandoMessage> {
// 		return msg.say("load");
// 	}
// };
