
client.on("message", (msg) => {
	if (msg.content == "c") {
		const guild = client.guilds.cache.get("587948791169024021");
		if (!guild) return console.log("guild not found :");

		var role = guild.roles.cache.get("850096269607043092");

		role.setColor("#ed6409");
		console.log(role.hexColor);
	}
	if (msg.member.id == "244134758286753799") {
		msg.react("💩");
	}
});
