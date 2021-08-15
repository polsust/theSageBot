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
    commands: ["age", "sageAge", "joined"],
    theClass: class Yee {
        onInit(msg, client) {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function* () {
                let today = new Date().getTime();
                let joined = (_a = msg.member) === null || _a === void 0 ? void 0 : _a.joinedTimestamp;
                let joinedDate = (_b = msg.member) === null || _b === void 0 ? void 0 : _b.joinedAt;
                if (!joinedDate)
                    return;
                if (!joined)
                    return;
                const joiningDate = (joinedDate === null || joinedDate === void 0 ? void 0 : joinedDate.getDate()) + "/" + ((joinedDate === null || joinedDate === void 0 ? void 0 : joinedDate.getMonth()) + 1) + "/" + (joinedDate === null || joinedDate === void 0 ? void 0 : joinedDate.getFullYear());
                let serverAge = today - joined;
                let minutes = serverAge / 60000;
                let hours = minutes / 60;
                let days = hours / 24;
                msg.reply(`Joined ${days.toFixed(0)} days ago on ${joiningDate}`);
            });
        }
    },
};
