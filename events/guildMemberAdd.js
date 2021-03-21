//Requires
const modulename = 'guildMemberAdd';
const { dir, log, logOk, logWarn, logError } = require('../lib/console')(modulename);

//Helpers
const gifs = [
    'https://tenor.com/view/the-office-dance-drinkingnsfw-gif-7490790',
    'https://tenor.com/view/lets-get-this-party-started-yeah-extremely-excited-kid-gif-15246266',
    'https://tenor.com/view/fresh-prince-of-bel-air-carlton-carlton-dance-excited-lets-get-this-party-started-gif-15161860',
    'https://tenor.com/view/lets-party-snoop-snoop-dogg-dance-dancing-gif-10839279',
];
const rndFromArray = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)]
}

module.exports = {
    async execute (config, member) {
        if(member.guild.memberCount % 1000 == 0){
            const gif = rndFromArray(gifs);
            this.sendAnnouncement(`<@${member.id}> YOU ARE MEMBER NUMBER ${member.guild.memberCount}!!!!\n${gif}`);
        }
        if (GlobalData.mutes.find(mute => mute.id == member.id && mute.expire > Date.now())) {
            member.roles.add(config.commands.mutedRole);
            member.send(`You are still muted in ${member.guild.name}. The mute will be cleared soon.`).catch(() => { /*noop*/ })
        }
    },
};
