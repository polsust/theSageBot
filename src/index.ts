import { CommandoClient } from "discord.js-commando";
import { TextChannel } from "discord.js";
import path from "path";
import { prefix, discordToken } from "./config.json";

const client: CommandoClient = new CommandoClient({
	commandPrefix: prefix,
	owner: "244134758286753799",
});

client.registry
	.registerDefaultTypes()
	.registerGroups([["steam"], ["other"]])
	.registerDefaultGroups()
	.registerDefaultCommands()
	.registerCommandsIn(path.join(__dirname, "commands"));

client.once("ready", () => {
	console.log(`Logged in as ${client.user?.tag}! (${client.user?.id})`);
	client.user?.setActivity("you from a dark corner", { type: "WATCHING" });

	// client.channels.fetch("").then((channel) => {
	// 	(channel as TextChannel).send("no");
	// });
});

client.on("error", console.error);

client.login(discordToken);

//when a specific user sends a message, react to it with a poop emoji
client.on("message", (msg) => {
	if (msg.author.id === "244517253750456320") {
		// msg.react("💩");
	}
});
//give a member a role to all new users
client.on("guildMemberAdd", (member) => {
	if (member.guild.id === "244135020401393665") {
		member.roles.add("244517253750456320").catch(console.error);
	}
});
