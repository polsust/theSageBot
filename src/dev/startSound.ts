import { Client } from "discord.js";

module.exports = async (client: Client) => {
	const channel: any = client.guilds.cache
		.get("587948791169024021")
		?.channels.cache.get("587948791169024029");

	//theBot
	let isConnected = channel?.members.get("850061636466245632");

	if (isConnected) {
		let connection = await channel?.join();
		connection?.disconnect();
		await channel?.join();
		return;
	}
	await channel?.join();

	// connection?.play("./src/assets/audio/beep.wav");
};
