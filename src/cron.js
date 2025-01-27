//Requires
const modulename = 'cron';
const axios = require("axios");
const fs = require('fs/promises');
const { MessageEmbed } = require("discord.js");
const humanizeDuration = require('humanize-duration');
const { dir, log, logOk, logWarn, logError } = require('./console')(modulename);
const { emojify } = require("../src/utils");

//Helpers
const now = () => { return Math.round(Date.now() / 1000) };
const anyUndefined = (...args) => { return [...args].some(x => (typeof x === 'undefined')) };


/**
 * txChungus bot class
 */
module.exports = class Cron {
    constructor(txChungus) {
        this.txChungus = txChungus;
        this.client = this.txChungus.client
        log('Setting up Cron');

        //Changelog
        setInterval(() => {
            this.updateChangelog('windows');
            this.updateChangelog('linux');
        }, 60 * 1000);

        //Status
        setInterval(() => {
            this.updateStats();
        }, 15 * 60 * 1000);

        //Temporary roles
        setInterval(() => {
            this.checkTempRoles();
        }, 60 * 1000);

        //Warnings cache
        setInterval(() => {
            txChungus.recentInfectedWarnings = [];
        }, 5 * 60 * 1000);

        //String blacklist
        setInterval(() => {
            this.updateBlacklist();
        }, 60 * 60 * 1000);

        //15s delayed start
        setTimeout(() => {
            this.updateChangelog('windows', true);
            this.updateChangelog('linux', true);
            this.updateStats(true);
            this.updateBlacklist();
        }, 15 * 1000);
    }

    //================================================================
    async updateStats () {
        try {
            const formatNumber = (num) => new Intl.NumberFormat('en-US').format(num);
            const meta = JSON.parse(await fs.readFile(this.txChungus.config.txStatsPath, 'utf8'));
            const playTimeSeconds = meta.stats.database.playTime * 60 * 1000;
            const txServersPct = (meta.servers.txAdmin.ratio*100).toFixed(0);
            const txPlayersPct = (meta.players.ratio * 100).toFixed(2);
            const humanizeOptions = {
                round: true,
                units: ['y', 'mo', 'w', 'd', 'h'],
                largest: 3,
                spacer: '',
                language: 'shortEn',
                languages: {
                    shortEn: {
                        y: () => "y",
                        mo: () => "mo",
                        w: () => "w",
                        d: () => 'd',
                        h: () => 'h',
                    },
                },
            };
            const embed = new MessageEmbed({
                color: '#76d4b2',
                footer: {text: 'Data from the public fivem server list. Updated hourly.'},
                thumbnail: { url: 'https://i.imgur.com/sAKCjLZ.gif' },
                fields: [
                    { 
                        name: ':mens: txAdmin players:',
                        value: `${formatNumber(meta.players.true)} (${txPlayersPct}% of total)`,
                    },
                    { 
                        name: ":file_folder: Online databases:", 
                        value: `
**Admins:** ${formatNumber(meta.stats.admins)}
**Players:** ${formatNumber(meta.stats.database.players)}
**Playtime:** ${humanizeDuration(playTimeSeconds, humanizeOptions)}
**Bans:** ${formatNumber(meta.stats.database.bans)}
**Warns:** ${formatNumber(meta.stats.database.warns)}
**Whitelist:** ${formatNumber(meta.stats.database.whitelists)}`, 
                    },
                    { 
                        name: ':point_right: txAdmin servers online:', 
                        value: `:point_right: ${emojify(meta.servers.txAdmin.true)}`, 
                    },
                    { 
                        name: ':point_right: txAdmin percent (%):', 
                        value: `:point_right: ${emojify(txServersPct)}<:percent:898702203198517299>`, 
                    },
                ]
            });

            const statsTrackerChannel = await this.txChungus.client.channels.resolve(this.txChungus.config.channels.statsTracker.channel);
            const targetMessage = await statsTrackerChannel.messages.fetch(this.txChungus.config.channels.statsTracker.message);
            await targetMessage.edit({embeds: [embed]});
            // log('Tracker status updated.');

        } catch (error) {
            logError(`Failed to refresh stats embed with error: ${error.message}`);
            dir(error)
        }
    }

    //================================================================
    async checkTempRoles () {
        const guild = this.client.guilds.cache.get(this.txChungus.config.guild);
        if (!guild) return logError("Guild not found");

        GlobalData.tempRoles.filter(t => t.expire <= Date.now()).forEach(async t => {
            try {
                const member = await GlobalActions.tempRoleRemove(t.role, t.id);
                if (member) {
                    if(t.role === 'muted'){
                        if(t.reason === 'account_too_new') return;
                        logOk(`Expiring mute from \`${t.id}\``);
                        member.send(`Your mute in ${guild.name} has expired.`).catch(()=>{});
                    }else if(t.role === 'newcomer'){
                        member.send(`You can now talk in the non-support channels of the txAdmin Server.\nJust please don't ask support questions in there okay?! :stuck_out_tongue_winking_eye:`).catch(()=>{});
                    }
                }
            } catch (error) {
                logWarn(`Removing role \`${t.role}\` from \`${t.id}\` probably failed`);
                dir(error)
            }
        })
    }

    //================================================================
    async updateChangelog (osType, firstTime = false) {
        try {
            //perform request - cache busting every ~33m
            const osTypeApiUrl = (osType == 'windows') ? 'win32' : 'linux';
            // const osTypeApiUrl = 'win32';
            const cacheBuster = Math.floor(now() / 2e3) % 1000;
            const reqUrl = `https://changelogs-live.fivem.net/api/changelog/versions/${osTypeApiUrl}/server?${cacheBuster}`;
            // const reqUrl = `https://changelogs-live.fivem.net/api/changelog/versions/win32/server?xxxxx`;
            const changelogReq = await axios.get(reqUrl);

            //check response
            if (!changelogReq.data) throw new Error('request failed');
            const changelog = changelogReq.data;
            // console.dir(changelog.support_policy_eol)
            if (anyUndefined(changelog.recommended, changelog.optional, changelog.latest, changelog.critical)) {
                throw new Error('expected values not found');
            }

            //fill in databus
            const osTypeRepoUrl = (osType == 'windows') ? 'server_windows' : 'proot_linux';
            GlobalData.fxserverVersions[osType] = {
                latest: parseInt(changelog.latest),
                optional: parseInt(changelog.optional),
                critical: parseInt(changelog.critical),
                recommended: parseInt(changelog.recommended),
                recommended_download: changelog.recommended_download,
                optional_download: changelog.optional_download,
                latest_download: changelog.latest_download,
                critical_download: changelog.critical_download,
                artifactsLink: `https://runtime.fivem.net/artifacts/fivem/build_${osTypeRepoUrl}/master/?${cacheBuster}`,
            }
            if (firstTime) log(`${osType} fxserver versions updated`);
        } catch (error) {
            // logWarn(`Failed to retrieve FXServer ${osType} update data with error: ${error.message}`);
            if (firstTime) dir(error.message)
        }
    }


    //================================================================
    async updateBlacklist () {
        try {
            //Downloading list
            const gh = await axios.get('https://raw.githubusercontent.com/DevSpen/links/master/src/links.txt');
            const domains = gh.data
                .split('\n')
                .map(x => x.toLowerCase().trim())
                .filter(x => x.length);

            //Selecting new ones
            const newDomains = domains.filter(x => !GlobalData.malwareStrings.includes(x));
            if(!newDomains.length) return log('Refreshed @DevSpen/links and found 0 new domains.');

            //this this is all terrible but its 4am and i'm tired
            const bannedStrings = GlobalData.malwareStrings.concat(newDomains).sort();
            const malwareStringsFile = `./data/malwareStrings_${GlobalData.profile}.txt`; 
            await fs.writeFile(malwareStringsFile, bannedStrings.join('\n'));

            //leaving a log behind
            return this.txChungus.sendAnnouncement(`Refreshed \`@DevSpen/links\` and added ${newDomains.length} new domains.`)
        } catch (error) {
            logError(`Failed to refresh banned domains from GH with error: ${error.message}`);
        }
    }

} //Fim Cron()
