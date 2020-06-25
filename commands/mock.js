module.exports = {
    description: 'Mocks a member.',
    async execute(message, args, txChungus) {
        if (!message.mentions.users.size) {
            return message.reply('you need to tag an user in order to mock them... fucktard');
        }
        const profilePicture = message.mentions.users.first().displayAvatarURL({ format: "png", dynamic: true });
        return message.channel.send(`Hahahaha just look at his face!\n${profilePicture}`);
    },
};
