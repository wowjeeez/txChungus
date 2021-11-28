//Requires
const modulename = 'messageCreate';
const stripAnsi = require('strip-ansi');
const { dir, log, logOk, logWarn, logError } = require('../src/console')(modulename);
const { messageContains, messageLinkContains } = require("../src/utils");

const handlers = {
    recommendedBuild: require('../messageHandlers/recommendedBuild'),
    showYourWork: require('../messageHandlers/showYourWork'),
    directMessages: require('../messageHandlers/directMessages'),
    general: require('../messageHandlers/general'),
}


module.exports = {
    async execute (message) {
        //Handler filter
        if (message.author.bot) return;
        if (message.guild && message.guild.id !== this.config.guild) return;
        if (typeof message.content === 'undefined'){
            logError(`Undefined message content:`);
            dir(message);
            return;
        }
        message.content = stripAnsi(message.content);

        //Check if message is from an admin
        const adminRoles = Object.values(this.config.adminsRoles);
        message.txIsAdmin = message.channel.type !== 'DM' 
            && (
                message.author.id === message.guild.ownerId 
                || message.member.roles.cache.hasAny(...adminRoles)
            )

        //Block malwares from spreading
        if(!message.txIsAdmin && messageLinkContains(message.content, GlobalData.malwareStrings)){
            if(message.channel.type === 'DM') return;

            logError(`${message.author.id} | ${message.author.tag} posted a malware:`);
            logError(message.content);
            message.delete().catch(() => { });
            if(!this.recentInfectedWarnings.includes(message.author.id)){
                this.recentInfectedWarnings.push(message.author.id);
                this.sendAnnouncement(`<@${message.author.id}> was infected by a malware that tried to spread itself in this guild and was muted for a week because of that.`);
                try {
                    const expiration = Date.now() + 10080 * 60e3;
                    await GlobalActions.tempRoleAdd('muted', message.author.id, expiration, 'malware_infection');
                } catch (error) {
                    dir(error)
                }
            }
            return;
        }
        if(!message.txIsAdmin && messageContains(message.content, this.config.autoMuteStrings)){
            if(message.channel.type === 'DM') return;

            logWarn(`${message.author.id} | ${message.author.tag} auto-muted for posting:`);
            logWarn(message.content);
            message.delete().catch(() => { });
            this.sendAnnouncement(`<@${message.author.id}> was muted for posting a suspect message likely containing a malware or trying to ping everyone.`);
            try {
                const expiration = Date.now() + 10080 * 60e3;
                await GlobalActions.tempRoleAdd('muted', message.author.id, expiration, 'likely_malware_infection');

                const cleanMessage = message.content.replace(/\`/g, '\\`').replace(/\n/g, '\n> ');
                const botLogChannel = message.guild.channels.cache.get(this.config.channels.botLog);
                await botLogChannel.send(`||<@272800190639898628>|| <@${message.author.id}> posted:\n${cleanMessage}`);
            } catch (error) {
                dir(error)
            }
            return;
        }

        //Check for mention spam
        // Joined last 24h
        // Mentions more than one person
        const dayAgo = Date.now() - 24 * 60 * 60e3;
        if(
            message.channel.type !== 'DM'
            && message.member.joinedTimestamp > dayAgo
            && message.mentions.users.size > 1
            && message.member.roles.cache.size <= 1
        ){
            try {
                const expiration = Date.now() + 10080 * 60e3;
                await GlobalActions.tempRoleAdd('muted', message.author.id, expiration, 'Likely mention spam');
                message.reply('You have been muted for one day for likely mention spam.')
            } catch (error) {
                dir(error)
            }
            return;
        }
        

        //Handler selection
        if (message.channel.id == this.config.channels.recommendedBuild.channel) {
            handlers.recommendedBuild(message, this);

        } else if (message.channel.id == this.config.channels.showYourWork) {
            handlers.showYourWork(message, this);

        } else if (message.channel.type == 'DM') {
            handlers.directMessages(message, this);

        } else if (message.channel.type == 'GUILD_TEXT') {
            handlers.general(message, this);

        } else {
            logWarn(`HandlerNotFound for message from ${message.author.tag} in ${message.channel.name} (${message.channel.type})`);
        }
    },
};
