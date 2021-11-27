//Requires
const modulename = 'DM';
const { dir, log, logOk, logWarn, logError } = require('../src/console')(modulename);
const { pickRandom } = require("../src/utils");

// add some "cute" message maybe asking for engagement on github?
// remover GlobalData.facts, deixar load ser no arquivo !fact

module.exports = DirectMessagesHandler = async (message, txChungus) =>{
    logWarn(`[${message.author.tag}] ${message.content}`);
    return message.channel.send(`Hey there :smile:
If you liked txAdmin, can you leave us a :star: on github? <https://github.com/tabarra/txAdmin>
Luv u :heart: `);
}
