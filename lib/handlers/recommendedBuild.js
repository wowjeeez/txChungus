//Requires
const modulename = 'RecommendedBuildHandler';
const fs = require('fs');
const { MessageEmbed } = require("discord.js");
const { dir, log, logOk, logWarn, logError } = require('../console')(modulename);


//Consts & vars
const dataFile = `./data/recommendations_${GlobalData.profile}.json`;
const maxRecommendations = 10;
let recommendations;
let targetMessage;

//Get file data
try {
    const rawJson = fs.readFileSync(dataFile, 'utf8');
    if (!rawJson.length) {
        recommendations = [];
        log(`Artifact recommendations reset.`);
    } else {
        recommendations = JSON.parse(rawJson).slice(-maxRecommendations);
        log(`Artifact recommendations loaded.`);
    }
} catch (error) {
    if (error.code == 'ENOENT') {
        fs.writeFileSync(dataFile, `[]`)
        recommendations = [];
    } else {
        logError(`Failed to load artifact recommendations data with error: ${error.message}`);
        process.exit(1);
    }
}


//Helpers
const scheduleDelete = async (message, delay = 15) => {
    if (!message.id) return;
    setTimeout(async () => {
        try {
            await message.delete();
        } catch (error) {
            logError(`Failed to delete message: [${message.author.tag}] ${message.content}`);
        }
    }, delay * 1000);
}

const replyDelete = async (message, text, delay = 15) => {
    if (!message.id) return;
    try {
        scheduleDelete(message);
        const outMsg = await message.reply(text);
        scheduleDelete(outMsg, delay);
    } catch (error) {
        logError(`Failed to reply to message: ${message.id}`)
    }
}

/**
 * Usage:
 *  - open the recommended channel and delete all messages
 *  - send some bot command (ex !help)
 *  - copy this message id and channel id
 *  - set up the recommendedBuild config
 */
module.exports = RecommendedBuildHandler = async (message, txChungus) => {
    //Sanity check
    if (message.author.id == message.client.user.id) return;
    if (!txChungus.config.channels.recommendedBuild.channel || !txChungus.config.channels.recommendedBuild.message) {
        return logWarn(`recommendedBuild.channel or recommendedBuild.message not set`)
    }

    //Check message input
    if (message.content.startsWith('!iuse')) {
        return replyDelete(message, `This channel usage changed, now you don't need to write \`!iuse\` before the version, just type in the artifact number like \`3052\`.`);
    }
    const buildNum = parseInt(message.content.trim());
    if (isNaN(buildNum)) {
        return replyDelete(message, `only FXServer Artifact/Build numbers are allowed in this channel. \nTry typing a build number like \`3052\`.`);
    }

    //Check for invalid artifacts
    if (buildNum < GlobalData.fxserverVersions.windows.critical) {
        return replyDelete(message, `this is below the latest critical build (${GlobalData.fxserverVersions.windows.critical}), you need to update.`);
    }
    if (buildNum > GlobalData.fxserverVersions.windows.latest) {
        return replyDelete(message, `this is above the latest build. You trying to mess with me?`);
    }


    //Adds recommendation and trims array
    recommendations = recommendations.filter(rec => rec.author !== message.author.id)
    recommendations.push({
        nick: message.author.tag,
        author: message.author.id,
        build: buildNum
    });
    if (recommendations.length >= maxRecommendations) {
        recommendations = recommendations.slice(-maxRecommendations);
    }

    //Saves data
    try {
        fs.writeFileSync(dataFile, JSON.stringify(recommendations, null, 2), 'utf8');
    } catch (error) {
        dir(error);
        return replyDelete(message, `Well, error...`);
    }

    //Process numbers
    const counter = {};
    recommendations.forEach(rec => {
        counter[rec.build] = (counter[rec.build]) ? counter[rec.build] + 1 : 1;
    });
    let recsTable = Object.entries(counter);
    let top3;
    if (recsTable.length < 3) {
        top3 = `Not enough data yet :frowning:`;
    } else {
        const orderedRecs = recsTable.sort((a, b) => {
            if (a[1] < b[1]) {
                return 1;
            }
            if (a[1] > b[1]) {
                return -1;
            }
            return 0;
        });
        top3 = [
            `:first_place: **${orderedRecs[0][0]}** (votes: ${orderedRecs[0][1]})`,
            `:second_place: **${orderedRecs[1][0]}** (votes: ${orderedRecs[1][1]})`,
            `:third_place: **${orderedRecs[2][0]}** (votes: ${orderedRecs[2][1]})`,
        ].join('\n')
    }

    //Creates message
    const finalMessage = new MessageEmbed({
        color: 0x69E0B9,
        title: "Recommended FXServer Artifact/Build",
        thumbnail: {
            url: "https://i.imgur.com/57hsnZ4.png"
        },
        description: `Please vote the build that you use and consider most stable.\nThis is an croudsourced fxserver build recomendation post based on the last **${maxRecommendations}** recommendations.`,
        fields: [
            {
                name: "How to vote:",
                value: "Just send a artifact/build number in this channel."
            },
            {
                name: "Results:",
                value: top3
            },
            {
                name: "Last 5 recommendations:",
                value: recommendations.slice(-5).reverse().map(x => x.build).join(', ')
            }
        ]
    });

    //React & Delete command usage
    try {
        scheduleDelete(message);
        await message.react('✅');
    } catch (error) {
        dir(error)
        return replyDelete(message, `Well, I failed to react to your message...`);
    }

    //Fetch target message
    if (!targetMessage) {
        try {
            targetMessage = await message.channel.messages.fetch(txChungus.config.channels.recommendedBuild.message);
        } catch (error) {
            dir(error)
            return replyDelete(message, `whoops, message update failed...`);
        }
    }
    return await targetMessage.edit({embeds: [finalMessage]});
}
