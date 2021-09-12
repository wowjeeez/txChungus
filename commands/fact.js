//Requires
const modulename = 'fact';
const { pickRandom } = require("../lib/utils");


module.exports = {
    rateLimit: false,
    aliases: ['facts'],
    description: 'testing things.',
    async execute (message, args, config) {
        return message.reply(`Fun fact:\n> ${pickRandom(GlobalData.facts)}`);
    },
};
