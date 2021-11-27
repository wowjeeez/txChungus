//Requires
const modulename = 'fact';
const fs = require('fs');
const { dir, log, logOk, logWarn, logError } = require("../../src/console")(modulename);
const { pickRandom } = require("../../src/utils");

//Consts & vars
const dataFile = `./data/facts.txt`;
let facts;

//Get file data
try {
    const factsFile = fs.readFileSync(dataFile, 'utf8');
    facts = factsFile.trim().split('\n');
} catch (error) {
    dir(error)
    logError('Failed to load facts.txt');
    facts = ['failed to load facts file :(']
}


module.exports = {
    rateLimit: false,
    aliases: ['facts'],
    description: 'nice random facts',
    async execute (message, args, config) {
        return message.reply(`Fun fact:\n> ${pickRandom(facts)}`);
    },
};
