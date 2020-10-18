//Requires
const modulename = 'DirectMessagesHandler';
const { dir, log, logOk, logWarn, logError } = require('../console')(modulename);

module.exports = DirectMessagesHandler = async (message, txChungus) =>{
    logWarn(`[DM][${message.author.tag}] ${message.content}`);
    return message.reply(`Yoo dude... how about no DMs??? Use the #help channel!`);
}
