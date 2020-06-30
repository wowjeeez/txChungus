//From: https://rosettacode.org/wiki/Magic_8-Ball
const answers = [
    `It is certain`,
    `It is decidedly so`,
    `Without a doubt`,
    `Yes, definitely`,
    `You may rely on it`,
    `As I see it, yes`,
    `Most likely`,
    `Outlook good`,
    `Signs point to yes`,
    `Yes`,
    `Reply hazy, try again`,
    `Ask again later`,
    `Better not tell you now`,
    `Cannot predict now`,
    `Concentrate and ask again`,
    `Don't bet on it`,
    `My reply is no`,
    `My sources say no`,
    `Outlook not so good`,
    `Very doubtful`,
];


module.exports = {
    description: 'Magic 8 ball knows everything.',
    async execute(message, args, txChungus) {
        const answer = answers[Math.floor(Math.random() * answers.length)];
        return message.reply(answer);
    },
};
