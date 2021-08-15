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
const node_fetch_1 = __importDefault(require("node-fetch"));
// require("dotenv").config("/.env");
module.exports = {
    commands: ["yee"],
    theClass: class Yee {
        onInit(msg, client) {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function* () {
                let voice = (_a = msg.member) === null || _a === void 0 ? void 0 : _a.voice;
                msg.react("<:miniYee:439201431678091264>");
                let connection = yield ((_b = voice === null || voice === void 0 ? void 0 : voice.channel) === null || _b === void 0 ? void 0 : _b.join());
                connection === null || connection === void 0 ? void 0 : connection.play("./src/assets/audio/yee.mp3");
                let baseUrl = `https://g.tenor.com/v1/random?key=${process.env.TENOR_KEY}`;
                node_fetch_1.default(`${baseUrl}&q=yeedinosaur`).then((data) => __awaiter(this, void 0, void 0, function* () {
                    let yee = yield data.json();
                    yee = yee.results;
                    console.log(yee);
                    let index = Math.floor(Math.random() * yee.length);
                    console.log(`${index} and the lenght ${yee.length}`);
                    msg.channel.send(yee[index].url);
                }));
            });
        }
    },
};
