//Requires
const modulename = 'test';
const fs = require('fs/promises');
const { MessageEmbed } = require("discord.js");
const humanizeDuration = require('humanize-duration');
const { dir, log, logOk, logWarn, logError } = require("../../lib/console")(modulename);
const { doesMessageContains } = require("../../lib/utils");



module.exports = {
    rateLimit: false,
    description: 'testing things.',
    async execute (message, args, config) {
        //Check permission
        if (!message.txIsAdmin) {
            return message.reply(`You're not allowed to use this command`);
        }

        return message.channel.send('aaaaaa');


    },
};
