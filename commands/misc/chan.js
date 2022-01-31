//Requires
const modulename = 'chan';
const { dir, log, logOk, logWarn, logError } = require("../../src/console")(modulename);

const defaultMessage = `:point_right: Please use the correct channel for this.
For txAdmin Help, please use <#589106731376836608>.
If you are using txAdmin on ZAP-Hosting, use <#827624202625744956>;
For FiveM server and resources use <#926721141639381073>.`;

module.exports = {
    description: 'Directs a person to a help channel',
    async execute(message, args, config) {
        //If no mention - just print message
        if (!message.mentions.users.size) {
            return message.channel.send(defaultMessage);
        }
        const mentionString = message.mentions.users.map(x => `<@${x.id}>`).join(' ');

        //If directed channel
        if(Object.keys(config.supportChannels).includes(args[0])){
            const pingChannel = message.guild.channels.cache.get(config.supportChannels[args[0]]);
            await pingChannel.send(`${mentionString} Try asking your question here!`);
        }else{
            await message.channel.send(`${mentionString} ${defaultMessage}`);
        }

        //If admin and on general
        if (message.txIsAdmin && message.channel.id === config.channels.general) {
            message.mentions.users.forEach(async (user) => {
                //user trying to chan chungus or himself
                if (user.id === message.author.id || user.id === message.client.user.id) return; 

                try {
                    const expiration = Date.now() + 15 * 60e3;
                    await GlobalActions.tempRoleAdd('newcomer', user.id, expiration, null);
                    await message.channel.send(`**${user.username}** You will be able to use this channel again in 15 minutes. For now use the help channels.`);
                } catch (error) {
                    message.reply('Something terrible just happened, fuck. Most likely the member left.');
                    dir(error)
                }
            })
        }
    }
};
