const { MessageAttachment } = require("discord.js");

const pickingGifs = [
	'https://tenor.com/view/math-zack-galifianakis-thinking-calculating-gif-5120792',
	'https://tenor.com/view/mr-bean-rowan-atkinson-bean-bean-movie-working-title-films-gif-15034599',
	'https://tenor.com/view/elmo-pass-out-black-out-faint-unconscious-gif-12708224',
	'https://tenor.com/view/madagscar-penguins-i-make-my-own-options-gif-9833864'
]

const rndFromArray = (arr) => {
	return arr[Math.floor(Math.random() * arr.length)]
}

module.exports = {
	rateLimit: {
		max: 1,
		resetTime: 30000, // in ms
		global: true // Rate limit individuals or everyone at once
	},
	description: 'Magic 8 ball knows everything.',
	async execute (message, args) {
		const thingsToPick = args.join(' ').split(/\sOR\s/g)

		if (thingsToPick.length <= 1) return message.channel.send('Stop trying me to pick from nothing dickhead!')

		const header =
			`${message.author} asked me to pick from:
			> ${thingsToPick.join(', ')}
			I picked:
			`.replace(/\t/g, '');
		const outMsg = await message.channel.send(header + rndFromArray(pickingGifs));
		const answer = rndFromArray(thingsToPick);

		setTimeout(() => {
			outMsg.edit(`${header} **${answer}**`);
		}, 5000);
	},
};
