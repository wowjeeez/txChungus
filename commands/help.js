//Requires
const modulename = 'latest';
const { dir, log, logOk, logWarn, logError } = require('../lib/console')(modulename);
const { MessageEmbed } = require('discord.js');

module.exports = {
    description: 'Lists all the registered commands.',
    async execute (message, args, config) {
        const [static, dynamic] = GlobalData.commands.partition(c => c.static);
        const dynamicCommands = [...dynamic.keys()].join(', ')
        const staticCommands = [...static.keys()].join(', ')
        const msgLines = [
            [...static.keys()].join(', '),
            [...dynamic.keys()].join(', '),
        ];
        const commandsEmbed = {
            color: 0x0099ff,
            title: 'Commands',
            fields: [
                {
                    name: ':robot: Dynamic Commands',
                    value:  dynamicCommands,
                },
                {
                    name: ':scroll: Static Commands:',
                    value: staticCommands,
                },
            ],
        };
        message.channel.send({ embed: commandsEmbed });
    },
};
