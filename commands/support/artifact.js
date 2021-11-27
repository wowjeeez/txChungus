//Requires
const modulename = 'latest';
const { MessageEmbed } = require("discord.js");
const { dir, log, logOk, logWarn, logError } = require("../../lib/console")(modulename);

//Helpers
const anyUndefined = (...args) => { return [...args].some(x => (typeof x === 'undefined')) };
const emojify = (src) => {
    let out = src.toString();
    out = out.replace(/0/g, ':zero:');
    out = out.replace(/1/g, ':one:');
    out = out.replace(/2/g, ':two:');
    out = out.replace(/3/g, ':three:');
    out = out.replace(/4/g, ':four:');
    out = out.replace(/5/g, ':five:');
    out = out.replace(/6/g, ':six:');
    out = out.replace(/7/g, ':seven:');
    out = out.replace(/8/g, ':eight:');
    out = out.replace(/9/g, ':nine:');
    return out;
}


module.exports = {
    description: 'Sends the user the artifacts link with cache buster.',
    aliases: ['artifacts'],
    async execute(message, args, config) {
        //Check if we have the data
        if (anyUndefined(
            GlobalData.fxserverVersions.windows,
            GlobalData.fxserverVersions.linux
        )) {
            return message.reply('IDK, FiveM stuff might be offline or something...');
        }

        //If mention
        let mentionString = '';
        if(message.mentions.users.size){
            mentionString = message.mentions.users.map(x => `<@${x.id}>`).join(' ');
        }


        const txVersionMsg = new MessageEmbed({
            color: 0x69E0B9,
            title: `⚠️Attention:`,
            description: `The FiveM artifacts page is heavily cached, and you are likely seeing an outdated version!
Use the **special** link below for the refreshed page!`,
            fields: [
                {
                    name: `📥 Latest Windows Artifact: ${emojify(GlobalData.fxserverVersions.windows.latest)}`,
                    value: GlobalData.fxserverVersions.windows.artifactsLink + '_fix_cache_' + GlobalData.fxserverVersions.windows.latest 
                },
                {
                    name: `📥 Latest Linux Artifact: ${emojify(GlobalData.fxserverVersions.linux.latest)}`,
                    value: GlobalData.fxserverVersions.linux.artifactsLink + '_fix_cache_' + GlobalData.fxserverVersions.linux.latest
                },
            ]
        });
        return message.channel.send(mentionString, txVersionMsg);

    },
};
