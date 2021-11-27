//Requires
const modulename = 'left';
const humanizeDuration = require('humanize-duration');
const { dir, log, logOk, logWarn, logError } = require("../../src/console")(modulename);

module.exports = {
    description: 'Tells when is the next update',
    async execute(message, args, config) {
        // return await message.reply(`no`);
        const hist = GlobalData.txVersions.history;
        const [lastVer, lastUpdate, lastDeltaDays] = hist[hist.length -1];
        const deadline = (lastUpdate + (lastDeltaDays * 86400));

        const mentionString = message.mentions.users.map(x => `<@${x.id}>`).join(' ');
        const timeleft = deadline*1000 - Date.now();
        const msgTime = (timeleft > 0) 
            ? `<t:${deadline}:R>`
            : '**RIGHT NOW!**\nhttps://tenor.com/view/hitmans-bodyguard-hitmans-bodyguard-gi-fs-samuel-l-jackson-time-tick-tock-gif-8352665'
        await message.channel.send(`${mentionString} **The next update is scheduled to be released:** ${msgTime}`);
    }
};
