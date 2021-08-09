"use strict";
const config_json_1 = require("../config.json");
module.exports = (client, commandOptions) => {
    let { commands, theClass } = commandOptions;
    client.on("message", (msg) => {
        const { member, content } = msg;
        if (commands === undefined || commands === {})
            return;
        if (!content.startsWith(config_json_1.prefix))
            return;
        for (const command of commands) {
            if (content.toLowerCase() === `${config_json_1.prefix}${command.toLowerCase()}`) {
                new theClass().onInit(msg, client);
                return;
            }
        }
    });
};
