"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = __importDefault(require("fs/promises"));
module.exports = {
    commands: ["tts", "pol"],
    theClass: class Tts {
        constructor() {
            this.audios = [];
        }
        onInit(msg, client, words) {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function* () {
                let path = "./src/assets/audio/tts/";
                let person = "pol";
                this.path = path + person;
                this.audios = yield promises_1.default.readdir(`./src/assets/audio/tts/${person}`);
                let voice = (_a = msg.member) === null || _a === void 0 ? void 0 : _a.voice;
                this.connection = yield ((_b = voice === null || voice === void 0 ? void 0 : voice.channel) === null || _b === void 0 ? void 0 : _b.join());
                setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    for (const word of words) {
                        yield this.readWord(word, msg);
                    }
                }), 500);
            });
        }
        readWord(word, msg) {
            return __awaiter(this, void 0, void 0, function* () {
                let wait = 100;
                for (let i = 0; i < word.length; i++) {
                    const previousLetter = word.charAt(i - 1);
                    const letter = word.charAt(i);
                    const nextLetter = word.charAt(i + 1);
                    if (this.audioExists(letter + nextLetter)) {
                        yield this.playAudio(letter, nextLetter);
                        i++;
                    }
                    else if (this.audioExists(previousLetter + letter)) {
                        yield this.playAudio(letter, previousLetter);
                    }
                    else if (this.audioExists(letter)) {
                        yield this.playAudio(letter);
                    }
                    else if (letter === ",") {
                        wait = 500;
                    }
                    else if (letter === ".") {
                        wait = 700;
                    }
                    else {
                        msg.channel.send(`Error: Character/s "${previousLetter}${letter}${nextLetter}" not interpreted`);
                    }
                }
                return new Promise((resolve) => {
                    setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                        resolve(true);
                    }), wait);
                });
            });
        }
        audioExists(silab) {
            return this.audios.includes(silab.toLowerCase() + ".wav");
        }
        playAudio(letter, nextLetter = "", previousLetter = "") {
            var _a;
            console.log(previousLetter + letter + nextLetter);
            const dispatcher = (_a = this.connection) === null || _a === void 0 ? void 0 : _a.play(this.path + "/" + previousLetter + letter + nextLetter + ".wav");
            return new Promise((resolve) => {
                setInterval(() => {
                    if (dispatcher === null || dispatcher === void 0 ? void 0 : dispatcher.writableEnded) {
                        resolve(true);
                    }
                }, 1);
            });
        }
    },
};
