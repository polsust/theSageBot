import {
  createAudioResource,
  createAudioPlayer,
  generateDependencyReport,
  joinVoiceChannel,
} from "@discordjs/voice";
import { Client, Message } from "discord.js";
import fetch from "node-fetch";

module.exports = {
  commands: ["yee"],
  theClass: class Yee {
    async onInit(msg: Message, _client: Client) {
      let voice = msg.member?.voice;

      console.log(generateDependencyReport());

      msg.react("<:miniYee:439201431678091264>");

      const connection = joinVoiceChannel({
        // @ts-ignore
        channelId: voice?.channel?.id,
        // @ts-ignore
        guildId: voice?.channel?.guild.id,
        // @ts-ignore
        adapterCreator: voice?.channel?.guild.voiceAdapterCreator,
      });

      const player = createAudioPlayer();

      try {
        console.log("play");
        player.play(createAudioResource("./src/assets/audio/yee.mp3"));
      } catch (error) {
        console.log(error);
      }

      let baseUrl = `https://g.tenor.com/v1/search?key=${process.env.TENOR_KEY}`;

      fetch(`${baseUrl}&q=yeedinosaurmeme&limit=9`).then(async (data: any) => {
        let yee = await data.json();
        yee = yee.results;

        let index = Math.floor(Math.random() * yee.length);

        msg.channel.send(yee[index].url);
      });
    }
  },
};
