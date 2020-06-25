//Requires
const modulename = 'latest';
const clone = require('clone');
const { MessageEmbed } = require("discord.js");
const { dir, log, logOk, logWarn, logError } = require('../lib/console')(modulename);

//Helpers
const anyUndefined = (...args) => { return [...args].some(x => (typeof x === 'undefined')) };


module.exports = {
    description: 'Send instructions for the latest FXserver + txAdmin.',
    async execute(message, args, config) {
        //Check if we have the data
        if (anyUndefined(
            GlobalData.fxserverVersions.windows,
            GlobalData.fxserverVersions.linux
        )) {
            return message.channel.send('IDK, FiveM stuff might be offline or something...');
        }

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

        //txAdmin info card
        let txVersionMsg;
        if(config.latestTXAdminVersionOnArtifact){
            txVersionMsg = new MessageEmbed({
                color: 0x69E0B9,
                title: `👉 Latest txAdmin: ${config.latestTXAdminVersion}`,
                description: `It already comes with FXServer ${config.latestTXAdminVersionOnArtifact} and above, so no need to download it separately!`
            });
        }else{
            txVersionMsg = new MessageEmbed({
                color: 0x69E0B9,
                title: `👉 Latest txAdmin: ${config.latestTXAdminVersion}`,
                description: `The most recent txAdmin version is still not present in the fxserver artifacts.
Download \`monitor-${config.latestTXAdminVersion}.zip\` from the following link:
https://github.com/tabarra/txAdmin/releases/latest
Then replace the \`citizen/system_resources/monitor\` folder contents with the files from the downloaded ZIP.
On linux, this folder is inside \`alpine/opt/cfx-server/citizen/system_resources\`.`
            });
        }
        message.channel.send(txVersionMsg);

        //FXServer info card
        const outMsg = new MessageEmbed({
            color: 0xEFAE87,
            title: `FXServer Artifact:`,
            fields: [
                {
                    name: `📥 Latest Windows: ${GlobalData.fxserverVersions.windows.latest}`,
                    value: GlobalData.fxserverVersions.windows.artifactsLink
                },
                {
                    name: `📥 Latest Linux: ${GlobalData.fxserverVersions.linux.latest}`,
                    value: GlobalData.fxserverVersions.linux.artifactsLink
                }
            ]
        });
        return message.channel.send(outMsg);
    },
};


/*
    https://api.github.com/repos/tabarra/txAdmin/releases
    https://api.github.com/repos/tabarra/txAdmin/releaseslatest
    https://api.github.com/repos/citizenfx/fivem/commits
*/
