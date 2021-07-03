//Discord
const fs = require("fs");
const Discord = require("discord.js");
const { prefix, discordToken } = require("./config.json");

const client = new Discord.Client();
client.commands = new Discord.Collection();
client.login(discordToken);

const commandFiles = fs
	.readdirSync("./commands")
	.filter((file) => file.endsWith(".js") || file.endsWith(".ts"));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.on("ready", () => {
	console.log("ready " + client.user.tag);

	const channel = client.channels.cache.get("587948791169024025");
	channel.send("Ready!");
});

client.on("message", (msg) => {
	if (!msg.content.startsWith(prefix) || msg.author.bot) return;

	const args = msg.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	if (!client.commands.has(command)) {
		return msg.reply("This command does not exist!");
	}

	try {
		client.commands.get(command).execute(msg, args);
	} catch (error) {
		console.error(error);
		msg.reply("There was an error trying to execute that command!");
	}
});
