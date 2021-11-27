//Requires
const modulename = 'latest';
const { MessageEmbed } = require("discord.js");
const { emojify, pickRandom } = require("../../lib/utils");
const { dir, log, logOk, logWarn, logError } = require("../../lib/console")(modulename);

//Consts
const waitGifs = [
    'https://tenor.com/view/shaquille-o-neal-excited-shaking-cant-wait-gif-13783587',
    'https://tenor.com/view/soon-okay-real-soon-very-quickly-in-a-second-just-a-moment-gif-15029375',
    'https://tenor.com/view/daddys-home2-daddys-home2gifs-jon-lithgow-reunion-waiting-gif-9683398',
    'https://tenor.com/view/cat-driving-serious-cat-driving-hold-on-gif-16076083',
    'https://tenor.com/view/judge-judy-double-time-faster-hurry-gif-7566976',
    'https://tenor.com/view/mr-bean-checking-time-waiting-gif-11570520',
    'https://tenor.com/view/off-work-almost-sleepy-gif-13396687',
]


module.exports = {
    description: 'Send instructions for the latest FXserver + txAdmin.',
    aliases: ['u'],
    async execute(message, args, config) {
        //If mention
        let mentionString = '';
        if (message.mentions.users.size) {
            mentionString = message.mentions.users.map(x => `<@${x.id}>`).join(' ');
        }

        //If in the wrong channel
        const blacklistedChannels = [
            '577993483600658436', //general
            '600111300915494922', //menu-feedback  
            '697102099892404344', //memes 
        ]
        if(blacklistedChannels.includes(message.channel.id)){
            await message.reply(`Please use <#589106731376836608>.`);
            await message.delete();
            return;
        }

        //Preparing the message
        if (GlobalData.txVersions.available) { 
            const updateMessage = new MessageEmbed({
                color: 0x69E0B9,
                title: `How to get txAdmin ${GlobalData.txVersions.latest}:`,
                description: `:point_right: You just need to update to artifact ${emojify(GlobalData.txVersions.fxsVersion)}
:point_right: You can just drag and drop to replace the files.

**<a:alert:897525925950914600> The "latest recommended" is outdated, use the links below!**
[<:windows:791692679419265044> Download Windows Artifact](${GlobalData.txVersions.fxsArtifacts.windows}).
[<:linux:780972840454979604> Download Linux Artifact](${GlobalData.txVersions.fxsArtifacts.linux}).
<:zap:823668080994811906> For ZAP Game Servers, you will get a notification when available.`
            });
            return message.channel.send(mentionString, updateMessage);
        } else {
            const gifLink = pickRandom(waitGifs);
            const updateMessage = `${mentionString} The ${GlobalData.txVersions.latest} will be available today, stay tuned!\n${gifLink}`;
            return message.channel.send(updateMessage);
        }
    },
};
