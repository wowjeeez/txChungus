//Requires
const modulename = 'left';
const humanizeDuration = require('humanize-duration');
const { dir, log, logOk, logWarn, logError } = require('../lib/console')(modulename);

module.exports = {
    description: 'How much time left to something',
    async execute(message, args, config) {
        // return await message.reply(`no`);
        const deadline = 1624271189000;
        const what = 'the v4.0 and v4.1 horde get the update notification';

        const mentionString = message.mentions.users.map(x => `<@${x.id}>`).join(' ');
        const timeleft = deadline - Date.now();
        const msgTime = (timeleft > 0) 
            ? humanizeDuration(timeleft) 
            : 'https://tenor.com/view/hitmans-bodyguard-hitmans-bodyguard-gi-fs-samuel-l-jackson-time-tick-tock-gif-8352665'
        await message.channel.send(`${mentionString} **Time until ${what}:**\n${msgTime}`);
    }
};
