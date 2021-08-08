/* //Steam
const SteamAPI = require("steamapi");
const steam = new SteamAPI("F575C6A6CAB8A56FA969228CC23C262A");

module.exports = {
	name: "f",
	async execute(msg, args) {
		if (args == "")
			//no args
			return msg.reply("Please enter a steam ID after the command");

		await msg.channel.send(getProfilePic(args));
	},
};
function getProfilePic(id) {
	steam
		.getUserSummary(id)
		.then((summary) => {
			return summary + "sum";
		})
		.catch((error) => {
			return "an error was produced";
		});
}
 */