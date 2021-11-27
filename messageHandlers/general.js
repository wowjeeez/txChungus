//Requires
const modulename = 'GeneralHandler';
const { dir, log, logOk, logWarn, logError } = require('../src/console')(modulename);

module.exports = GeneralHandler = async (message, txChungus) => {
    //Check if its a command
    if (!message.content.startsWith(txChungus.config.prefix)) return;

    //Parse message
    const args = message.content
        .slice(txChungus.config.prefix.length)
        .split(/\s+/)
        .filter(a => a.length && !a.startsWith('<@'));
    if (!args.length) return;

    //Get command
    let commandName = args.shift().toLowerCase();
    let command = GlobalData.commands.get(commandName);
    //Check if it's an alias or return
    if(!command) {
        commandName = GlobalData.commands.findKey(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        command = GlobalData.commands.get(commandName);
        if (!command) return;
    }


    /* Rate limiter */ //this is poggu's code, and sometimes it bugs in a way nobody can do !m8b anymore
    if (command.rateLimit?.max && command.rateLimit?.resetTime && message.author.id !== '272800190639898628') {
        const limitData = command.limitData || { members: [] }
        let count = (command.rateLimit.global ? limitData.members?.global : limitData.members?.[message.author.id]) || 0;

        if (count >= command.rateLimit.max) {
            return message.channel.send(`You can use this command in ${command.rateLimit.resetTime / 1000} seconds`);
        }

        count++;

        setTimeout(() => {
            count--;
            if (count == 0) count = null;
            command.rateLimit.global ? limitData.members.global = count : limitData.members[message.author.id] = count;
        }, command.rateLimit.resetTime);

        command.rateLimit.global ? limitData.members.global = count : limitData.members[message.author.id] = count;
        command.limitData = limitData;
    }


    //Logs, adds to the stats
    // log(`[${message.author.tag}] ${message.content}`);
    txChungus.addUsageStats(commandName);

    //Executes command
    try {
        command.execute(message, args, txChungus.config);
    } catch (error) {
        logError(`Error executing ${commandName}: ${error.message}`);
    }

}
