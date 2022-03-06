//Requires
const modulename = 'unmute';
const { dir, log, logOk, logWarn, logError } = require("../../src/console")(modulename);

module.exports = {
    description: 'Unmutes a person if some retard accidently mutes someone',
    async execute (message, args, config) {
        //Check permission
        if (!message.txIsAdmin) {
            return message.reply(`You're not allowed to use this command.`);
        }

        const mention = message.mentions.members.first();
        if (!mention) return message.reply('Mention the user you want to be unmuted, retard...');

        //Check if the user is muted
        const currentMute = GlobalData.tempRoles.filter(t => ((t.role === 'muted' || t.role === 'newcomer') && t.id === mention.user.id));
        if(!currentMute){
            message.channel.send(`This user isn't muted.`);
        }

        try {
            try {
                await GlobalActions.tempRoleRemove('muted', mention.user.id);
            } catch(err) {}

            try {
                await GlobalActions.tempRoleRemove('newcomer', mention.user.id);
            } catch(err) {}
            
            message.channel.send(`Unmuted \`${mention.displayName}\`.`);
        } catch (error) {
            message.reply('Something terrible just happened, fuck. Most likely the member left.');
            dir(error)
        }

        mention.send(`You have been unmuted from ${message.guild.name}.`)
            .catch(() => logWarn("Failed to send a dm, propably disabled dms"))
    }
};
