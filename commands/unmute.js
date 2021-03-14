//Requires
const modulename = 'unmute';
const { dir, log, logOk, logWarn, logError } = require('../lib/console')(modulename);

module.exports = {
	description: 'Unmutes a person if some retard accidently mutes someone',
	async execute (message, args, config) {
		//Check permission
		if (!config.admins.includes(message.author.id)) {
			return message.reply(`You're not allowed to use this command`);
		}

		const mention = message.mentions.members.first();
		if (!mention) return message.reply('Mention the user you want to be unmuted, retard...');

		if (mention.roles.cache.has(config.mutedRole) || GlobalData.mutes.find((mute) => mute.id == mention.user.id)) {
			mention.roles.remove(config.mutedRole).catch(() => message.channel.send('Something terrible just happened, fuck. Most likely missing permissions'));
			GlobalData.removeMute(mention.user.id)

			message.channel.send(`Unmuted \`${mention.displayName}\`.`);
			mention.send(`You have been unmuted from ${message.guild.name}.`).catch(() => logWarn("Failed to send a dm, propably disabled dms"))
		} else {
			message.channel.send(`This user isn't muted, idiota.`);
		}

	}
};
