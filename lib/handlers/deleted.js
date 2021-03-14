//Requires
const modulename = 'DeletedHandler';
const { dir, log, logOk, logWarn, logError } = require('../console')(modulename);

module.exports = DeletedHandler = async (message, txChungus) => {
    logWarn(`[deleted][${message.author.tag}] ${message.content}`);
}
