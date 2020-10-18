//Requires
const modulename = 'DeletedHandler';
const { dir, log, logOk, logWarn, logError } = require('../console')(modulename);

module.exports = DeletedHandler = async (message) =>{
    if(message.author.bot) return;
    logWarn(`[deleted][${message.author.tag}] ${message.content}`);
}
