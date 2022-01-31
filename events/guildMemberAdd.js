//Requires
const modulename = 'guildMemberAdd';
const { dir, log, logOk, logWarn, logError } = require('../src/console')(modulename);
const { pickRandom } = require("../src/utils");

//Helpers
const gifs = [
    'https://tenor.com/view/the-office-dance-drinkingnsfw-gif-7490790',
    'https://tenor.com/view/lets-get-this-party-started-yeah-extremely-excited-kid-gif-15246266',
    'https://tenor.com/view/fresh-prince-of-bel-air-carlton-carlton-dance-excited-lets-get-this-party-started-gif-15161860',
    'https://tenor.com/view/lets-party-snoop-snoop-dogg-dance-dancing-gif-10839279',
];
const scheduleDelete = async(message, delay = 30) => {
    if(!message.id) return;
    setTimeout(async () => {
        try {
            await message.delete();
        } catch (error) {
            logError(`Failed to delete message: [${message.author.tag}] ${message.content}`);
        }
    }, delay*1000);
}

module.exports = {
    async execute (member) {
        // if(member.guild.memberCount % 1000 == 0){
        //     const gif = pickRandom(gifs);
        //     this.sendAnnouncement(`<@${member.id}> YOU ARE MEMBER NUMBER ${member.guild.memberCount}!!!!\n_(unless someone quits)_\n${gif}`);
        // }

        //DEBUG if(member.id === '778133189771526164')
        
        //Set member as newcomer
        // try {
        //     const expiration = Date.now() + 14 * 60e3;
        //     await GlobalActions.tempRoleAdd('newcomer', member.id, expiration, null);
        // } catch (error) {
        //     logError(`Failed to set newcomer role with error: ${error.message}`);
        // }

        //Mute new accounts
        const threeDaysAgo = Date.now() - 3 * 24 * 60 * 60e3;
        if(member.user.createdTimestamp > threeDaysAgo){
            try {
                const expiration = Date.now() + 7 * 24 * 60 * 60e3;
                await GlobalActions.tempRoleAdd('muted', member.id, expiration, 'account_too_new');
                this.sendAnnouncement(`<@${member.id}> Your account is too new. To prevent spam you have been muted for a few days, sorry :(`);
            } catch (error) {
                dir(error)
            }
        }

        //Sending welcome message
        try {
            const msg = await this.helloChannel.send(`<@${member.id}> Welcome! Please read the message above for the most used support commands.
Also, please read the last <#578045190955335691>!`);
            scheduleDelete(msg);
        } catch (error) {
            logError(`Failed to send welcome message with error: ${error.message}`);
        }


        //Check if the user has pending temp roles
        const pendingRoles = GlobalData.tempRoles.filter(t => (t.id === member.id && t.role !== 'newcomer'));
        pendingRoles.forEach(t => {
            member.roles.add(this.config.tempRoles[t.role]).catch(() => { /*noop*/ });
            log(`Reapplying role ${t.role} for ${member.displayName}`);
            if(t.role === 'muted'){
                member.send(`You are still muted in ${member.guild.name}. The mute will be cleared soon.`).catch(() => { /*noop*/ });
            }else if(t.role === 'anythingsdfsdf'){
                //dm??
            }
        })
    },
};
