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
module.exports = (client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const channel = (_a = client.guilds.cache
        .get("587948791169024021")) === null || _a === void 0 ? void 0 : _a.channels.cache.get("587948791169024029");
    //theBot
    let isConnected = channel === null || channel === void 0 ? void 0 : channel.members.get("850061636466245632");
    if (isConnected) {
        let connection = yield (channel === null || channel === void 0 ? void 0 : channel.join());
        connection === null || connection === void 0 ? void 0 : connection.disconnect();
        yield (channel === null || channel === void 0 ? void 0 : channel.join());
        return;
    }
    yield (channel === null || channel === void 0 ? void 0 : channel.join());
    // connection?.play("./src/assets/audio/beep.wav");
});
