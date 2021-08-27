//Requires
const { pickRandom } = require("../lib/utils");
const pickingGifs = [
    'https://tenor.com/view/math-zack-galifianakis-thinking-calculating-gif-5120792',
    'https://tenor.com/view/mr-bean-rowan-atkinson-bean-bean-movie-working-title-films-gif-15034599',
    'https://tenor.com/view/elmo-pass-out-black-out-faint-unconscious-gif-12708224',
    'https://tenor.com/view/madagscar-penguins-i-make-my-own-options-gif-9833864'
]


module.exports = {
    rateLimit: {
        max: 1,
        resetTime: 15000, // in ms
        global: true // Rate limit individuals or everyone at once
    },
    description: 'Will pick one between few options.',
    async execute (message, args) {
        const userOptions = args.join(' ').split(/(?:\s+or\s+|[,;/\|\n])+/i);
        const thingsToPick = userOptions.map(x => x.trim()).filter(x => x.length);

        if (thingsToPick.length <= 1) return message.channel.send('Stop trying me to pick from nothing, dickhead!');
        const header = [
            `${message.author} asked me to pick from:`,
            `> ${thingsToPick.join(', ')}`,
            `I picked:`,
            `> `
        ].join('\n');
        const outMsg = await message.channel.send(header + pickRandom(pickingGifs));
        const answer = pickRandom(thingsToPick);

        setTimeout(() => {
            outMsg.edit(`${header} **${answer}**`);
        }, 5000);
    },
};
