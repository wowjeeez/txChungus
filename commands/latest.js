//Requires
const modulename = 'latest';
const { MessageEmbed } = require("discord.js");
const { dir, log, logOk, logWarn, logError } = require('../lib/console')(modulename);

//Helpers
const anyUndefined = (...args) => { return [...args].some(x => (typeof x === 'undefined')) };


module.exports = {
    description: 'Send instructions for the latest FXserver + txAdmin.',
    aliases: ['update'],
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

        // const updateMessage = `${mentionString} The update is not yet available, but will be out *very very* Soon! Please check <#578045190955335691>!`;
        // return message.channel.send(updateMessage);

        //If !latest full
        if(args.length && args[0] == 'full'){
            const tplWindows = 'FXServer windows versions info:\n```json\n{{replace}}```\n';
            const outWindows = tplWindows.replace('{{replace}}', JSON.stringify(GlobalData.fxserverVersions.windows, null, 2));
            message.channel.send(outWindows);
            const tplLinux = 'FXServer linux versions info:\n```json\n{{replace}}```\n';
            const outLinux = tplLinux.replace('{{replace}}', JSON.stringify(GlobalData.fxserverVersions.linux, null, 2));
            message.channel.send(outLinux);
            return;
        }

        //Prepare message
        const manualUpdateText = `Download \`monitor-${config.latestTXAdminVersion}.zip\` from the following link:
        https://github.com/tabarra/txAdmin/releases/latest
        Then inside the artifacts folder, replace the \`citizen/system_resources/monitor\` folder contents with the files from the downloaded ZIP.
        On Linux, this folder is inside \`alpine/opt/cfx-server/citizen/system_resources\`.`;

        //In case fxserver already have the latest txAdmin
        if(config.latestTXAdminVersionOnArtifact){
            let isRecentBuildMessage = '';
            if(config.latestTXAdminVersionOnArtifact + 32 > GlobalData.fxserverVersions.windows.latest){
                isRecentBuildMessage = 'Click on the special link below to see the latest artifact.';
            }
            const txVersionMsg = new MessageEmbed({
                color: 0x69E0B9,
                title: `👉 Latest txAdmin: ${config.latestTXAdminVersion}`,
                description: `It already comes with FXServer **${config.latestTXAdminVersionOnArtifact}** and above, so no need to download it separately! ${isRecentBuildMessage}`,
                fields: [
                    {
                        name: `📥 Latest Windows Artifact: ${GlobalData.fxserverVersions.windows.latest}`,
                        value: GlobalData.fxserverVersions.windows.artifactsLink
                    },
                    {
                        name: `📥 Latest Linux Artifact: ${GlobalData.fxserverVersions.linux.latest}`,
                        value: GlobalData.fxserverVersions.linux.artifactsLink
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
                title: `👉 Latest txAdmin: ${config.latestTXAdminVersion}`,
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
