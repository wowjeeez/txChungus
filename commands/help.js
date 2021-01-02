//Requires
const modulename = 'latest';
const { dir, log, logOk, logWarn, logError } = require('../lib/console')(modulename);


module.exports = {
    description: 'Lists all the registered commands.',
    async execute (message, args, config) {
        const [static, dynamic] = GlobalData.commands.partition(c => c.static);

        message.channel.send(
            `\`\`\`diff
            + Static commands:
            ${[...static.keys()].join(', ')}

            + Dynamic commands:
            ${[...dynamic.keys()].join(', ')}
            \`\`\``.replace(/  +/g, '')  // Remove indentation because javascript is stupid..
        );

    },
};
