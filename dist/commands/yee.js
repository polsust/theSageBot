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
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    commands: ["yee"],
    theClass: class Yee {
        onInit(msg, client) {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function* () {
                let voice = (_a = msg.member) === null || _a === void 0 ? void 0 : _a.voice;
                if (!(voice === null || voice === void 0 ? void 0 : voice.channelID)) {
                    msg.reply("You must be in a voice channel to use this command.");
                    return;
                }
                let connection = yield ((_b = voice.channel) === null || _b === void 0 ? void 0 : _b.join());
                connection === null || connection === void 0 ? void 0 : connection.play("./src/assets/audio/yee.mp3");
            });
        }
    },
};
