//Requires
const modulename = "unmute";
const { codeBlock } = require("../lib/utils");
const { logError } = require("../lib/console")(modulename);
const { MessageEmbed } = require("discord.js");
const humanizeDuration = require("humanize-duration");

module.exports = {
    description: 'Lists all the mutes',
    async execute (message, args, config) {
        //Check permission
        if (!config.admins.includes(message.author.id)) {
            return message.reply(`You're not allowed to use this command`);
        }

        if (!GlobalData.mutes.length) {
            return await message.channel.send(`Nobody is muted right now.`);
        }

        const msgEmbed = new MessageEmbed()
            .setTitle("Muted Users")
            .setColor("AQUA")
            .setTimestamp();

        for (const mutedUser of GlobalData.mutes) {
            const member = await message.guild.members
                .fetch(mutedUser.id)
                .catch(() => logError(`Error fetching user`));

            const durationOptions = {
                round: true,
                largest: 2,
                spacer: "",
                language: "shortEn",
                languages: {
                    shortEn: {
                        w: () => "w",
                        d: () => "d",
                        h: () => "h",
                        m: () => "m",
                        s: () => "s",
                    },
                },
            };

            const fieldValue = `${mutedUser.reason}\n${codeBlock(
                "Unmuted " +
                humanizeDuration(mutedUser.expire - Date.now(), durationOptions)
            )}`;

            const fieldTitle = member.displayName || "Unknown";
            msgEmbed.addField(fieldTitle, fieldValue, true);
        }

        return await message.channel.send(msgEmbed);
    },
};
