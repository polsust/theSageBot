// import fs from "fs/promises";
// import { Client, Message, VoiceConnection } from "discord.js";
//
// module.exports = {
// 	commands: ["pol"],
// 	theClass: class Tts {
// 		audios: string[] = [];
// 		connection: VoiceConnection | undefined;
// 		path: string | undefined;
//
// 		async onInit(msg: Message, client: Client, words: string[]) {
// 			let path = "./src/assets/audio/tts/";
//
// 			// get just the person from the message
// 			let person = msg.content.substring(1, msg.content.indexOf(" "));
//
// 			this.path = path + person;
//
// 			this.audios = await fs.readdir(`./src/assets/audio/tts/${person}`);
//
// 			let voice = msg.member?.voice;
// 			this.connection = await voice?.channel?.join();
// 			setTimeout(async () => {
// 				for (const word of words) {
// 					await this.readWord(word, msg);
// 				}
// 			}, 500);
// 		}
// 		async readWord(word: string, msg: Message) {
// 			let wait: number = 100;
// 			for (let i = 0; i < word.length; i++) {
// 				const previousLetter: string = word.charAt(i - 1);
// 				const letter: string = word.charAt(i);
// 				const nextLetter: string = word.charAt(i + 1);
//
// 				if (this.audioExists(letter + nextLetter)) {
// 					await this.playAudio(letter, nextLetter);
// 					i++;
// 				} else if (this.audioExists(letter)) {
// 					await this.playAudio(letter);
// 				} else if (letter === ",") {
// 					wait = 500;
// 				} else if (letter === ".") {
// 					wait = 700;
// 				} else {
// 					msg.channel.send(`Error: Character/s "${letter}" not interpreted`);
// 				}
// 			}
//
// 			return new Promise((resolve) => {
// 				setTimeout(async () => {
// 					resolve(true);
// 				}, wait);
// 			});
// 		}
// 		private audioExists(silab: string): boolean {
// 			return this.audios.includes(silab.toLowerCase() + ".mp3");
// 		}
// 		private playAudio(
// 			letter: string,
// 			nextLetter: string = "",
// 			previousLetter: string = ""
// 		): Promise<Boolean> {
// 			console.log(previousLetter + letter + nextLetter);
//
// 			const dispatcher = this.connection?.play(
// 				this.path +
// 					"/" +
// 					previousLetter.toLowerCase() +
// 					letter.toLowerCase() +
// 					nextLetter.toLowerCase() +
// 					".mp3"
// 			);
//
// 			return new Promise((resolve) => {
// 				setInterval(() => {
// 					if (dispatcher?.writableEnded) {
// 						resolve(true);
// 					}
// 				}, 1);
// 			});
// 		}
// 	},
// };
