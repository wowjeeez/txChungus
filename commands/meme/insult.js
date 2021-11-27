//Requires
const modulename = 'insult';
const fs = require('fs');
const { dir, log, logOk, logWarn, logError } = require("../../src/console")(modulename);
const { pickRandom } = require("../../src/utils");

//Consts & vars
const dataFile = `./data/insults.txt`;
let insults;

//Get file data
try {
    //Insults from https://corz.org/public/docs/miscy/insults.txt
    const insultsFile = fs.readFileSync(dataFile, 'utf8');
    insults = insultsFile.trim().split('\n');
} catch (error) {
    logError('Failed to load insults.txt');
    insults = ['failed to load insults file :(']
}


module.exports = {
    description: 'Insults a member.',
    async execute(message, args, config) {
        if(!message.mentions.users.size){
            return message.reply('you need to tag an user in order to insult them... fucktard');
        }
        const isSelfMentioned = message.mentions.users.filter((u) => u.id == message.client.user.id);
        if(isSelfMentioned.size){
            return message.reply('you really thought that was gonna work?');
        }

        const mentionString = message.mentions.users.map(x => `<@${x.id}>`).join(' ');
        const outMsg = (mentionString + `, ` + pickRandom(insults));
        return message.channel.send(outMsg);
    },
};
