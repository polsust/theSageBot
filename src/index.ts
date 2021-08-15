import { Client } from "discord.js";
import path from "path";
import fs from "fs";
console.log(path.join(__dirname, "../.env"));

require("dotenv").config(path.join(__dirname, "../.env"));

const client = new Client();
const disbut = require("discord-buttons");
disbut(client);

client.once("ready", () => {
	const onInit = require(path.join(__dirname, "dev", "startSound.js"));
	onInit(client);

	//commands
	console.log(client.user?.username + " is ready!");
	client.user?.setActivity("https://www.youtube.com/watch?v=dQw4w9WgXcQ", {
		type: "WATCHING",
	});

	const baseFile = "command-base.js";
	const commandBase = require(`./commands/${baseFile}`);

	const readCommands = (dir: string) => {
		const files: any = fs.readdirSync(path.join(__dirname, dir));

		for (const file of files) {
			const stat = fs.lstatSync(path.join(__dirname, dir, file));
			if (stat.isDirectory()) {
				readCommands(path.join(dir, file));
			} else if (file != baseFile) {
				const option = require(path.join(__dirname, dir, file));
				commandBase(client, option);
			}
		}
	};

	readCommands("commands");
});

//events
process.on("unhandledRejection", (error) => {
	console.error("Unhandled promise rejection:", error);
});

client.on("disconnect", () => {
	client.user?.setActivity("Disconnected");
});

client.on("typingStart", (channel: any, user: any) => {
	console.log(`${user.username} is typing in ${channel.name}`);
});

// client.on("clickButton", (b: MessageComponent) => {
// 	console.log(b.id);
// });

console.log(process.env.DISCORD_KEY);

client.login(process.env.DISCORD_KEY);
