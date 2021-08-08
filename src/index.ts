import { Client } from "discord.js";
import path from "path";
import fs from "fs";
import { prefix, discordToken } from "./config.json";

const client = new Client();

client.once("ready", () => {
	console.log(client.user?.username + " is ready!");

	const baseFile = "command-base.js";
	const commandBase = require(`./commands/${baseFile}`);

	const readCommands = (dir: string) => {
		// console.log(path.join(__dirname, dir));

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

client.login(discordToken);

