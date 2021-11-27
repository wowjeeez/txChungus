//Requires
const modulename = 'DM';
const fs = require('fs');
const { dir, log, logOk, logWarn, logError } = require('../console')(modulename);
const { pickRandom } = require("../utils");

module.exports = DirectMessagesHandler = async (message, txChungus) =>{
    logWarn(`[${message.author.tag}] ${message.content}`);
    return message.channel.send(`Fun fact:\n> ${pickRandom(GlobalData.facts)}`);
}
