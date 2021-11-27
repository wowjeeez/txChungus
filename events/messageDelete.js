//Requires
const modulename = 'messageDelete';
const stripAnsi = require('strip-ansi');
const { dir, log, logOk, logWarn, logError } = require('../src/console')(modulename);


module.exports = {
    async execute (message) {
        //Handler filter
        if (message.author.bot) return;
        if (message.guild && message.guild.id !== this.config.guild) return;
        if (typeof message.content === 'undefined'){
            logError(`Undefined message content:`);
            dir(message);
            return;
        }
        message.content = stripAnsi(message.content);

        const mentionString = (message.mentions.users.size)
            ? '{' + message.mentions.users.map(x => x.username).join(' ') + '}'
            : '';
        const attachments = (message.attachments.size > 0) 
            ? '{' + message.attachments.first().attachment + '}'
            : '';
        logWarn(`[${message.author.tag}] ${message.content} ${attachments} ${mentionString}`);
    },
};
