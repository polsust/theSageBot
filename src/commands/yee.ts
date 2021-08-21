import { Client, Message } from "discord.js";
import fetch from "node-fetch";

module.exports = {
	commands: ["yee"],
	theClass: class Yee {
		async onInit(msg: Message, client: Client) {
			let voice = msg.member?.voice;

			msg.react("<:miniYee:439201431678091264>");

			let connection = await voice?.channel?.join();

			connection?.play("./src/assets/audio/yee.mp3");

			let baseUrl = `https://g.tenor.com/v1/random?key=${process.env.TENOR_KEY}`;

			fetch(`${baseUrl}&q=yeedinosaur`).then(async (data: any) => {
				let yee = await data.json();
				yee = yee.results;
				console.log(yee);

				let index = Math.floor(Math.random() * yee.length);

				msg.channel.send(yee[index].url);
			});
		}
	},
};
