//Requires
const modulename = 'latest';
const { emojify, pickRandom } = require("../lib/utils");
const { dir, log, logOk, logWarn, logError } = require('../lib/console')(modulename);

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
        let updateMessage;
        if (GlobalData.txVersions.available) {
            updateMessage = `${mentionString} **To update to ${GlobalData.txVersions.latest} you just need to update to artifact ${emojify(GlobalData.txVersions.fxsVersion)}!**
Please use the two links below to download that _specific_ version:
<:windows:791692679419265044> ${GlobalData.txVersions.fxsArtifacts.windows}
<:linux:780972840454979604> ${GlobalData.txVersions.fxsArtifacts.linux}`;
// <:zap:823668080994811906> For ZAP servers, update to artifact \`4821\`.
        } else {
            const gifLink = pickRandom(waitGifs);
            updateMessage = `${mentionString} The ${GlobalData.txVersions.latest} will be available today, stay tuned!\n${gifLink}`;
        }

        return message.channel.send(updateMessage);
    },
};
