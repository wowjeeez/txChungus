//Requires
const modulename = 'unmute';
const { dir, log, logOk, logWarn, logError } = require('../lib/console')(modulename);

module.exports = {
	description: 'Unmutes a person if some retard accidently mutes someone',
	async execute (message, args, config) {

		//Check permission from lidl config
		if (!config.admins.includes(message.author.id)) {
			return message.reply(`You're not allowed to use this command`);
		}

		const mention = message.mentions.members.first()
		const muteRole = message.guild.roles.cache.find(r => r.name.toLowerCase().includes("mute"))

		if (!mention) return message.reply('Mention the user you want to be unmuted retard...');

		if (!muteRole) {
			return message.channel.send(`What the fuck, how came you muted a person when there's no mute role`)
		}

		if (mention.roles.cache.has(muteRole.id) || GlobalData.mutes.find((mute) => mute.id == mention.user.id)) {
			mention.roles.remove(muteRole).catch(() => message.channel.send('Something terrible just happened, fuck. Most likely missing permissions'));
			GlobalData.removeMute(mention.user.id)

			message.channel.send(`> Successfully unmuted ${mention.displayName}`)
			mention.send(`You have been unmuted from ${message.guild.name}`).catch(() => logWarn("Failed to send a dm, propably disabled dms"))
		} else {
			message.channel.send(`This user isn't muted idiota`)
		}

	}
};
