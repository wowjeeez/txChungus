//Requires
const modulename = 'GeneralHandler';
const { dir, log, logOk, logWarn, logError } = require('../console')(modulename);

module.exports = GeneralHandler = async (message, txChungus) =>{
    //Check if its a command
    if(!message.content.startsWith(txChungus.config.prefix)) return;

    //Parse message & gets command
    const args = message.content.slice(txChungus.config.prefix.length).split(/\s+/);
    const commandName = args.shift().toLowerCase();
    const command = GlobalData.commands.get(commandName) 
                    || GlobalData.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    //Check if the command exists
    if(!command) return;

    //Logs, adds to the stats
    log(`[${message.author.tag}] ${message.content}`);
    txChungus.addUsageStats(commandName);

    //Executes command
    try {
        command.execute(message, args, txChungus.config.commands);
    } catch (error) {
        logError(`Error executing ${commandName}: ${error.message}`);
    }
    
}
