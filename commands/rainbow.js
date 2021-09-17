//Requires
const modulename = 'test';
const fs = require('fs/promises');
const { MessageEmbed } = require("discord.js");
const humanizeDuration = require('humanize-duration');
const { dir, log, logOk, logWarn, logError } = require('../lib/console')(modulename);
const { doesMessageContains } = require("../lib/utils");



module.exports = {
    rateLimit: false,
    description: 'testing things.',
    async execute (message, args, config) {
        //Check permission
        if (!message.txIsAdmin) {
            return message.reply(`You're not allowed to use this command`);
        }

        return "someone plz fixx this thanks bye"

        const thingy = ['tx1', 'tx2', 'tx3', 'tx4', 'tx5', 'tx6', 'tx7'];
        for (let i = 0; i < thingy.length; i++) {
            console.log(thingy.map((x) => `:${x}:`).join(' '));
            thingy.push(thingy.shift());
        }

    },
};
