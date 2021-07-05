//Requires
const modulename = 'DeletedHandler';
const { dir, log, logOk, logWarn, logError } = require('../console')(modulename);

module.exports = DeletedHandler = async (message, txChungus) => {
    const attachments = (message.attachments.size > 0) 
        ? `{${message.attachments.first().attachment}}`
        : ''
    logWarn(`[deleted][${message.author.tag}] ${message.content} ${attachments}`);
}
