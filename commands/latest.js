//Requires
const modulename = 'latest';
const { emojify, anyUndefined } = require("../lib/utils");
const { MessageEmbed } = require("discord.js");
const { dir, log, logOk, logWarn, logError } = require('../lib/console')(modulename);


module.exports = {
    description: 'Send instructions for the latest FXserver + txAdmin.',
    aliases: [],
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

        //If !latest full
        if(true || args.length && args[0] == 'full'){
            const tplWindows = 'FXServer windows versions info:\n```json\n{{replace}}```\n';
            const outWindows = tplWindows.replace('{{replace}}', JSON.stringify(GlobalData.fxserverVersions.windows, null, 2));
            message.channel.send(outWindows);
            const tplLinux = 'FXServer linux versions info:\n```json\n{{replace}}```\n';
            const outLinux = tplLinux.replace('{{replace}}', JSON.stringify(GlobalData.fxserverVersions.linux, null, 2));
            message.channel.send(outLinux);
            return;
        }

        //FIXME: idk if I should delete this command or not...
        

        //In case fxserver already have the latest txAdmin
        if(config.commands.latestTXAdminVersionOnArtifact){
            let isRecentBuildMessage = '';
            if(config.commands.latestTXAdminVersionOnArtifact + 32 > GlobalData.fxserverVersions.windows.latest){
                isRecentBuildMessage = 'Click on the **special link** below to see the latest artifact.';
            }
            const txVersionMsg = new MessageEmbed({
                color: 0x69E0B9,
                title: `👉 Latest txAdmin: ${config.commands.latestTXAdminVersion}`,
                description: `It already comes with FXServer **${config.commands.latestTXAdminVersionOnArtifact}** and above, so no need to download it separately! ${isRecentBuildMessage}`,
                fields: [
                    {
                        name: `📥 Latest Windows Artifact: ${emojify(GlobalData.fxserverVersions.windows.latest)}`,
                        value: GlobalData.fxserverVersions.windows.artifactsLink + '_fix_cache_' + GlobalData.fxserverVersions.windows.latest 
                    },
                    {
                        name: `📥 Latest Linux Artifact: ${emojify(GlobalData.fxserverVersions.linux.latest)}`,
                        value: GlobalData.fxserverVersions.linux.artifactsLink + '_fix_cache_' + GlobalData.fxserverVersions.linux.latest
                    },
                    {
                        name: "👉 Downloading separately from FXServer:",
                        value: manualUpdateText
                    },
                ]
            });
            return message.channel.send(mentionString, txVersionMsg);

        //In case this version is still not available with fxserver
        }else{
            const txVersionMsg = new MessageEmbed({
                color: 0x69E0B9,
                title: `👉 Latest txAdmin: ${config.commands.latestTXAdminVersion}`,
                description: `The most recent txAdmin version is not yet present in the fxserver artifacts.\n${manualUpdateText}`
            });
            return message.channel.send(mentionString, txVersionMsg);
        }

    },
};


/*
    https://api.github.com/repos/tabarra/txAdmin/releases
    https://api.github.com/repos/tabarra/txAdmin/releaseslatest
    https://api.github.com/repos/citizenfx/fivem/commits
*/
