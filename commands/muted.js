//Requires
const modulename = "unmute";
const { codeBlock } = require("../lib/utils");
const { dir, log, logOk, logWarn, logError } = require('../lib/console')(modulename);
const { MessageEmbed } = require("discord.js");
const humanizeDuration = require("humanize-duration");

//Consts
const hour = 60 * 60 * 1000;
const day = 24 * hour;
const week = 7 * day;

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


module.exports = {
    description: 'Lists all the mutes',
    async execute(message, args, config) {
        //Check permission
        if (!config.admins.includes(message.author.id)) {
            return message.reply(`You're not allowed to use this command`);
        }
        const guild = message.guild;
        const showTime = (args.length && args[0] == 'full');

        if (!GlobalData.mutes.length) {
            return await message.channel.send(`Nobody is muted right now.`);
        }

        //Calculating ranges
        const now = Date.now();
        const mutedLessHour = [];
        const mutedLessDay = [];
        const mutedLessWeek = [];
        const mutedOverWeek = [];
        GlobalData.mutes.forEach(mutedUser => {
            const expiration = mutedUser.expire - now;
            if (expiration < hour) {
                mutedLessHour.push(mutedUser);
            } else if (expiration < day) {
                mutedLessDay.push(mutedUser);
            } else if (expiration < week) {
                mutedLessWeek.push(mutedUser);
            } else {
                mutedOverWeek.push(mutedUser);
            }
        });

        const muteRangeInfo = async (range) => {
            if (range.length) {
                const out = [];
                for (let i = 0; i < range.length; i++) {
                    const mute = range[i];
                    let memberName;
                    try{
                        const member = await guild.members.fetch(mute.id);
                        memberName = member.displayName;
                    }catch{
                        memberName = mute.id;
                    }
                    if(showTime){
                        const expTime = humanizeDuration(mute.expire - now, durationOptions).padStart(7, ' ');
                        const expTimeTag = `[${expTime}]`;
                        out.push(` ➤ ${codeBlock(expTimeTag)} ${codeBlock(memberName)}: ${mute.reason};`);
                    }else{
                        out.push(` ➤ ${codeBlock(memberName)}: ${mute.reason}`);
                    }
                }
                return out.join('\n');
            } else {
                return ` ➤ Nobody... yet :eyes:`;
            }
        }

        //Message time :)
        const messageLines = [
            `:zipper_mouth: **Expiration in less than one hour:**`, await muteRangeInfo(mutedLessHour), null,
            `:zipper_mouth: **Expiration in less than one day:**`, await muteRangeInfo(mutedLessDay), null,
            `:zipper_mouth: **Expiration in less than one week:**`, await muteRangeInfo(mutedLessWeek), null,
            `:zipper_mouth: **Lol forget about those loosers:**`, await muteRangeInfo(mutedOverWeek), null,
        ]
        return await message.channel.send(messageLines.join('\n'));
    },
};
