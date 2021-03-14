//Requires
const modulename = 'guildMemberAdd';
const { dir, log, logOk, logWarn, logError } = require('../lib/console')(modulename);

module.exports = {
	async execute (config, member) {
		if (GlobalData.mutes.find(mute => mute.id == member.id && mute.expire > Date.now())) {
			const muteRole = member.guild.roles.cache.find(r => r.name.toLowerCase().includes("mute"))
			if (!muteRole) return logError('Fucking bitch fix your server, you are missing a mute role. Mute someone to automatically create mute role')

			member.roles.add(muteRole)
			member.send(`You have been given your mute role back due to your recent reconnect in ${member.guild.name}`).catch(() => { /*noop*/ })
		}
	},
};
