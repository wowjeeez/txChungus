//Requires
const modulename = 'guildMemberAdd';
const { dir, log, logOk, logWarn, logError } = require('../lib/console')(modulename);

module.exports = {
	async execute (config, member) {
		// channel = member.guild.channels.cache.get("820668742215925810");
		// channel.send("Welcome " + member.displayName + "\n Member Count: " + member.guild.memberCount);
		if (GlobalData.mutes.find(mute => mute.id == member.id && mute.expire > Date.now())) {
			member.roles.add(config.commands.mutedRole);
			member.send(`You are still muted in ${member.guild.name}. The mute will be cleared soon.`).catch(() => { /*noop*/ })
		}
	},
};
