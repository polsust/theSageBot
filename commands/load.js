module.exports = {
	name: "l",
	async execute(msg, args) {
		var mymsg;
		var loadState = [
			"❌❌❌❌ LOADING ",
			"✅❌❌❌ LOADING .",
			"✅✅❌❌ LOADING ..",
			"✅✅✅❌ LOADING ...",
			"✅✅✅✅ LOADING ",
		];

		mymsg = await msg.channel.send(loadState[0]);

		var i = 0;

		var load = setInterval(() => {
			i++;
			mymsg.edit(loadState[i]);
			if (i == loadState.length - 1) i = -1;
		}, 1500);
	},
};
