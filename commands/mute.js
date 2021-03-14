//Requires
const modulename = 'mute';
const { dir, log, logOk, logWarn, logError } = require('../lib/console')(modulename);

const validTimes = { m: 60000, h: 3600000, d: 86400000 }

const parseTime = (str) => {
	// some weird regex i don't know where i got but does the job
	let match = str.match(/(-?(?:\d+\.?\d*|\d*\.?\d+)(?:e[-+]?\d+)?)([d,h,m,s])/)
	if (match && validTimes[match[2]]) {
		return parseInt(match[1] * validTimes[match[2]])
	}
	return
}

module.exports = {
	description: 'Mutes a person for x amount of time',
	async execute (message, args, config) {

		//Check permission from lidl config
		if (!config.admins.includes(message.author.id)) {
			return message.reply(`You're not allowed to use this command`);
		}

		const mention = message.mentions.members.first()

		if (!mention || !args[1]) return message.reply('Please use the correct command format. `!mute @mention 1d/1h/1m reason`');
		if (mention.user.id === message.author.id) return message.reply('You are utterly retarded.');
		if (GlobalData.mutes.find(mute => mute.id == mention.id)) return message.reply('This person is already muted');

		let muteRole = message.guild.roles.cache.find(r => r.name.toLowerCase().includes("mute"))

		if (!muteRole) {
			message.channel.send(`> Mute role not found, creating a new one!`)
			try {
				muteRole = await message.guild.roles.create({
					data: {
						name: 'Muted',
						color: '#4a4a4a',
						permissions: [],
						mentionable: false
					}
				})

				message.guild.channels.cache.forEach(async (channel) => {
					await channel.overwritePermissions([
						{
							id: muteRole.id,
							deny: ['SEND_MESSAGES', 'ADD_REACTIONS'],
						},
					]);
				});
			} catch (err) {
				return message.channel.send('Something terrible just happened, fuck. Most likely missing permissions')
			}
		}

		mention.roles.add(muteRole).catch(() => message.channel.send('Something terrible just happened, fuck. Most likely missing permissions'));

		let parsedTime = parseTime(args[1])
		if (!parsedTime) return message.channel.send('Invalid time dumbass')
		const reason = args.slice(2).join(" ") || 'No reason specified'

		GlobalData.addMute({ id: mention.user.id, expire: Date.now() + parsedTime, reason })
		message.channel.send(`> Successfully muted ${mention.displayName} for ${args[1]} (Reason: ${reason})`)
		mention.send(`You have been muted for ${args[1]} (Reason: ${reason})`).catch(() => logWarn("Failed to send a dm, propably disabled dms"))

	}
};
