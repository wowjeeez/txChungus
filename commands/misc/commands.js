//Requires
const modulename = 'latest';
const { dir, log, logOk, logWarn, logError } = require("../../lib/console")(modulename);
const { MessageEmbed } = require('discord.js');

module.exports = {
    description: 'Lists all the registered commands.',
    aliases: ['cmds'],
    async execute (message, args, config) {
        
        const categories = {
            admin: [],
            meme: [],
            misc: [],
            support: [],
        }
        GlobalData.commands.forEach((cmd, cmdName) => {
            // categories[cmd.category].push(`\`${cmdName}\``);
            categories[cmd.category].push(cmdName);
            // if(cmd.static){
            //     categories[cmd.category].push(cmdName);
            // }else{
            //     categories[cmd.category].push(`**${cmdName}**`);
            // }
        })

        const commandsEmbed = new MessageEmbed({
            color: 0x0099ff,
            // title: 'Commands',
            fields: [
                {
                    name: `:beginner: Support Commands (${categories.support.length}):`,
                    value: categories.support.join(', '),
                },
                {
                    name: `:zany_face: Meme Commands (${categories.meme.length}):`,
                    value: categories.meme.join(', '),
                },
                {
                    name: `:robot: Misc Commands (${categories.misc.length}):`,
                    value:  categories.misc.join(', '),
                },
                {
                    name: `<a:TheCyanWiggle:772508968328101928> Admin Commands (${categories.admin.length}):`,
                    value:  categories.admin.join(', '),
                },
            ],
        });
        message.channel.send(commandsEmbed);
    },
};
