//Requires
const modulename = 'latest';
const { dir, log, logOk, logWarn, logError } = require('../lib/console')(modulename);
const { MessageEmbed } = require('discord.js');

module.exports = {
    description: 'Lists all the registered commands.',
    aliases: ['cmds'],
    async execute (message, args, config) {
        const [static, dynamic] = GlobalData.commands.partition(c => c.static);
        const commandsEmbed = new MessageEmbed({
            color: 0x0099ff,
            title: 'Commands',
            fields: [
                {
                    name: ':robot: Dynamic Commands:',
                    value:  [...dynamic.keys()].join(', '),
                },
                {
                    name: ':scroll: Static Commands:',
                    value: [...static.keys()].join(', '),
                },
            ],
        });
        message.channel.send(commandsEmbed);
    },
};
