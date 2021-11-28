//Requires
const modulename = 'test';
const fs = require('fs/promises');
const { dir, log, logOk, logWarn, logError } = require("../../src/console")(modulename);
const { messageContains } = require("../../src/utils");

module.exports = {
    rateLimit: false,
    description: 'adds a string to the data/malwareStrings_xxx.txt file',
    async execute (message, args, config) {
        //Check permission
        if (!message.txIsAdmin) {
            return message.reply(`You're not allowed to use this command`);
        }

        //Sanity check
        if(args.length !== 1){
            return message.reply('Usage: `!blacklist example.com`');
        }else if(args[0].length < 5) {
            return message.reply('This string is too small, you probably doing something wrong.');
        }else if(args[0].includes('/')) {
            return message.reply('I already told you guys, blacklist the DOMAIN ONLY!');
        }else if(messageContains(args[0], GlobalData.malwareStrings)) {
            return message.reply('This string is already blacklisted.');
        }
        logWarn(`${message.author.username} blacklisted '${args[0]}'`);

        //Saving blacklist
        const bannedStrings = GlobalData.malwareStrings.concat(args[0]).sort();
        try {
            //this this is all terrible but its 4am and i'm tired
            const malwareStringsFile = `./data/malwareStrings_${GlobalData.profile}.txt`; 
            await fs.writeFile(malwareStringsFile, bannedStrings.join('\n'));

            //leaving a log behind
            const botLogChannel = message.guild.channels.cache.get(config.channels.botLog);
            await botLogChannel.send(`||<@272800190639898628>|| <@${message.author.id}> blacklisted: \`${args[0]}\`.`);
            return message.reply(`string blacklisted.`);
        } catch (error) {
            dir(error)
            return message.reply(`Some error occured, talk to tabarra`);
        }
    },
};
