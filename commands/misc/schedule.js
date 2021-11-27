//Requires
const modulename = 'schedule';
const humanizeDuration = require('humanize-duration');
const { dir, log, logOk, logWarn, logError } = require("../../lib/console")(modulename);


module.exports = {
    description: 'Shows the update deadline schedule.',
    async execute(message, args, config) {
        const showFull = (args.length && args[0] == 'full');
        const now = Date.now();
        const outLines = GlobalData.txVersions.history
            .slice(showFull ? null : -5)
            .map(([ver, txVerBBLastUpdate, deltaDays]) => {
                const txAdminVersionBestBy = (txVerBBLastUpdate + (deltaDays * 86400))*1000;
                const timeDiff = now - txAdminVersionBestBy;
                const ts = Math.floor(txAdminVersionBestBy/1000)
                if(timeDiff > 0){
                    return `**${ver}**: expired at <t:${ts}:D>`;
                }else{
                    return `**${ver}**: expires in <t:${ts}:R>`;
                }
            })
            .join('\n');

        const mentionString = message.mentions.users.map(x => `<@${x.id}>`).join(' ');
        const msg = 'Every txAdmin version comes with a "best by" date by which an "please update" message appears.';
        await message.channel.send(`${mentionString} ${msg}\n${outLines}`);
    }
};
