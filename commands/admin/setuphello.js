//Requires
const modulename = 'test';
const { MessageEmbed } = require("discord.js");
const { dir, log, logOk, logWarn, logError } = require("../../src/console")(modulename);


module.exports = {
    rateLimit: false,
    description: 'testing things.',
    async execute(message, args, config) {
        //Check permission
        if (!message.txIsAdmin) {
            return message.reply(`You're not allowed to use this command`);
        }

        // // const helloChannel = message.guild.channels.cache.get(config.channels.hello);
        const helloChannel = message.guild.channels.resolve(config.channels.hello.channel);
        const targetMessage = await helloChannel.messages.fetch(config.channels.hello.message);
        // const helloChannel = message.guild.channels.resolve('845771649189806142');
        // const targetMessage = await helloChannel.messages.fetch('926629106777477220');

        const embed = new MessageEmbed({
            color: 0x4287F5,
            title: "Support Commands:",
            thumbnail: { url: 'https://i.imgur.com/sAKCjLZ.gif' },
            description: `:keyboard: **!update**
To get the latest txAdmin update instructions.

:keyboard: **!localhost**
Find out how to access txAdmin from outside of the server/vps (localhost).

:keyboard: **!admin**
Find out how to reset the master account password.

:point_right: **Channels**
➤ <#589106731376836608> For txAdmin Help;
➤ <#926721141639381073> For FiveM server and resources;
➤ <#827624202625744956> For txAdmin on ZAP-Hosting.`,
        });

        await targetMessage.edit({ embeds: [embed] });

        return message.channel.send('done, probably');
    },
};
