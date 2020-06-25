//Requires
const modulename = 'latest';
const { dir, log, logOk, logWarn, logError } = require('../lib/console')(modulename);


module.exports = {
    description: 'Lists all the registered commands.',
    async execute(message, args, config) {
        const [static, dynamic] = GlobalData.commands.partition(c => c.static);

        const staticTemplate = 'Static commands:\n```\n{{replace}}```';
        const staticCmds = [...static.keys()].join(', ');
        const outStatic = staticTemplate.replace('{{replace}}', staticCmds);
        message.channel.send(outStatic);

        const dynamicTemplate = 'Dynamic commands:\n```\n{{replace}}```';
        const dynamicCmds = [...dynamic.keys()].join(', ');
        const outDynamic = dynamicTemplate.replace('{{replace}}', dynamicCmds);
        message.channel.send(outDynamic);
    },
};
