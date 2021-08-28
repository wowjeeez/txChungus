//Requires
const modulename = 'prune';
const { dir, log, logOk, logWarn, logError } = require('../lib/console')(modulename);

module.exports = {
    description: 'deletes X messages.',
    aliases: ['delete', 'purge'],
    async execute(message, args, config) {
        //Check permission
        if (!message.txIsAdmin) {
            return message.reply(`You're not allowed to use this command.`);
        }

        //Check amount
        const amount = parseInt(args[0]) + 1;
        if (isNaN(amount)) {
            return message.reply(`that doesn't seem to be a valid number.`);
        } else if (amount <= 1) {
            return message.reply(`you need to input a number above 1.`);
        }

        //Attempt to delete in bulk
        try {
            const toPrune = Math.min(amount, 100);
            await message.channel.bulkDelete(toPrune, true);
            return message.channel.send(`<@${message.author.id}> Pruned ${toPrune} messages.`);
        } catch (error) {
            dir(error)
            return message.reply(`well, apparently I can't.`);
        }
    }
};
