const units = [
    'Planck time',
    'yoctosecond',
    'jiffy',
    'zeptosecond',
    'attosecond',
    'femtosecond',
    'Svedberg',
    'picosecond',
    'nanosecond',
    'shake',
    'microsecond',
    'millisecond',
    'jiffy',
    'second',
    'decasecond',
    'minute',
    'moment',
    'hectosecond',
    'decaminute',
    'ke',
    'kilosecond',
    'hour',
    'hectominute',
    'kilominute',
    'day',
    'week',
    'megasecond',
    'fortnight',
    'lunar month',
    'month',
    'Fiscal year',
    'semester',
    'year',
    'common year',
    'tropical year',
    'Gregorian year',
    'sidereal year',
    'leap year',
    'triennium',
    'quadrennium',
    'olympiad',
    'lustrum',
    'decade',
    'indiction',
    'gigasecond',
    'jubilee',
    'century',
    'millennium',
    'terasecond',
    'Megannum',
    'petasecond',
    'galactic year',
    'cosmological decade',
    'aeon',
    'exasecond',
    'zettasecond',
    'yottasecond',
];
const shakingGif = `https://media1.tenor.com/images/aa574640b0f3e2c22a4798233212e35d/tenor.gif?itemid=13052487`;

module.exports = {
    description: 'When will something happen?!',
    async execute(message, args, config) {
        // return message.reply('shut the fuck up')
        const question = message.content.substring(message.content.indexOf(' ')+1);
        const header = `<@${message.author.id}> asked:\n> When ${question}\nMagic 8 Ball says:\n> `;
        const outMsg = await message.channel.send(header + shakingGif);
        const unit = units[Math.floor(Math.random() * units.length)];
        const time = Math.round(Math.random()*100)
        setTimeout(() => {
            outMsg.edit(`${header} In **${time} ${unit}s**`);
        }, 5000);
    },
};
