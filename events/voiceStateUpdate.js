//Requires
const modulename = 'voice';
const { dir, log, logOk, logWarn, logError } = require('../src/console')(modulename);


module.exports = {
    async execute (oldState, newState) {
        const guild = oldState.guild;
        const member = await guild.members.fetch(newState.id);
        
        if(newState.channelId == null){
            const oldChannel = await guild.channels.cache.find(c => c.id == oldState.channelId);
            log(`[${member.user.tag}] just left '${oldChannel.name}'`);
        }else if(oldState.channelId !== newState.channelId){
            const newChannel = await guild.channels.cache.find(c => c.id == newState.channelId);
            log(`[${member.user.tag}] just joined '${newChannel.name}'`);
        }
    },
};
