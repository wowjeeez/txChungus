//Requires
const modulename = 'unmute';
const humanizeDuration = require('humanize-duration');
const { dir, log, logOk, logWarn, logError } = require('../lib/console')(modulename);

const code = (x) => `\`${x}\``;

module.exports = {
	description: 'Lists all the mutes',
	async execute (message, args, config) {
		//Check permission
		if (!config.admins.includes(message.author.id)) {
			return message.reply(`You're not allowed to use this command`);
		}

		if(!GlobalData.mutes.length){
			return await message.channel.send(`Nobody is muted right now.`);
		}

		const outLines = [];
		for (let i = 0; i < GlobalData.mutes.length; i++) {
			const mute = GlobalData.mutes[i];
			const member = await message.guild.members.fetch(mute.id);
			const expiration = humanizeDuration(mute.expire - Date.now(), { round: true });
			const who = `[${member.id}][${member.displayName}]`;
			outLines.push(`${code(who)} is muted for more ${code(expiration)} for ${code(mute.reason)}.`);
		}

		return await message.channel.send(outLines.join('\n'));
	}
};
