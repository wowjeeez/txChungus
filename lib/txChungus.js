//Requires
const fs = require('fs-extra');
const path = require("path");
const Discord = require("discord.js");
const Cron = require("./cron.js");
const { dir, log, logOk, logWarn, logError } = require('./console')();
const commandsFolderPath = 'commands';

//NOTE: this shouldn't be a thing, but it is. Deal with it (:
global.GlobalData = {
    profile: null,
    commands: new Discord.Collection(),
    cmdStats: {},
    fxserverVersions: {}
}


/**
 * txChungus bot class
 */
module.exports = class txChungus {
    constructor(config, profile) {
        this.config = config;
        GlobalData.profile = profile;
        this.client = null;
        this.announceChannel = null;
        log('Starting...');
        this.setupStats();
        this.setupCommands();
        this.startBot();
        this.handlers = {
            deleted: require('./handlers/deleted'),
            recommendedBuild: require('./handlers/recommendedBuild'),
            showYourWork: require('./handlers/showYourWork'),
            directMessages: require('./handlers/directMessages'),
            general: require('./handlers/general'),
        }
        this.cron = new Cron();
    }


    //================================================================
    async setupStats(){
        try {
            const rawJson = await fs.readFile(`./data/stats_${GlobalData.profile}.json`, 'utf8');
            if(!rawJson.length){
                GlobalData.cmdStats = {};
                logOk(`Usage reset`);
            }else{
                GlobalData.cmdStats = JSON.parse(rawJson);
                logOk(`Loaded usage stats`);
            }
        } catch (error) {
            logError(`Failed to load usage stats data with error: ${error.message}`);
            process.exit(1);
        }
    }


    //================================================================
    async setupCommands(){
        const commandFiles = fs.readdirSync(commandsFolderPath);

        commandFiles.forEach(file => {
            const filePath = path.resolve(commandsFolderPath, file);
            const fileInfo = path.parse(file);

            if(fileInfo.ext == '.js'){
                const command = require(filePath);
                GlobalData.commands.set(fileInfo.name, command);

            }else if(fileInfo.ext == '.txt'){
                const staticMessage = fs.readFileSync(filePath, 'utf8');
                const command = {
                    static: true,
                    description: `Static reply for ${this.config.prefix}${fileInfo.name}`,
                    async execute(message, args, config) {
                        const mentionString = message.mentions.users.map(x => `<@${x.id}>`).join(' ');
                        const outMsg = (mentionString + `\n` + staticMessage).trim();
                        return message.channel.send(outMsg);
                    },  
                };
                GlobalData.commands.set(fileInfo.name, command);
            }else{
                return logError(`Unknown format: ${file}`);
            }
            
            logOk(`Loaded: ${file}`);
        });
        // dir(GlobalData.commands)
    }


    //================================================================
    async startBot(){
        //Setup client
        this.client = new Discord.Client({
            disableMentions: 'everyone',
            autoReconnect:true
        });

        //Setup event listeners
        this.client.on('ready', async () => {
            logOk(`Started and logged in as '${this.client.user.tag}'`);
            this.client.user.setActivity('you guys', {type: 'WATCHING'});
            this.announceChannel = await this.client.channels.resolve(this.config.channels.announce);
            if(!this.announceChannel){
                logError(`Announcements channel not found: ${this.config.channels.announce}`);
            }
            const outMsg = new Discord.MessageEmbed({
                color: 0x4287F5,
                description: `People just kind of associate me with kicking some ass.`,
                // description: `Honestly? Mee6 is just a lil bitch...`,
                // description: `WHAT IS HAPPENING HEREEEEEEE`,
                // description: `xxxxxxxxx`,
            });
            // this.sendAnnouncement(outMsg);
        });
        this.client.on('message', this.messageHandler.bind(this));
        this.client.on('messageDelete', this.messageHandler.bind(this));
        this.client.on('error', (error) => {
            logError(error.message);
        });
        this.client.on('resume', (error) => {
            logOk('Connection with Discord API server resumed');
        });

        //Start bot
        try {
            await this.client.login(this.config.token);
        } catch (error) {
            logError(error.message);
            process.exit();
        }
    }


    //================================================================
    async sendAnnouncement(message){
        if(
            !this.config.channels.announce ||
            !this.client ||
            this.client.ws.status ||
            !this.announceChannel
        ){
            logWarn(`returning false, not ready yet`, 'sendAnnouncement');
            return false;
        }

        try {
            this.announceChannel.send(message);
        } catch (error) {
            logError(`Error sending Discord announcement: ${error.message}`);
        }
    }//Final sendAnnouncement()


    //================================================================
    async addUsageStats(cmd){
        GlobalData.cmdStats[cmd] = (typeof GlobalData.cmdStats[cmd] == 'undefined')? 1 : GlobalData.cmdStats[cmd] +1;
        try {
            const rawJson = JSON.stringify(GlobalData.cmdStats, null, 2);
            await fs.writeFile(`./data/stats_${GlobalData.profile}.json`, rawJson, 'utf8');
        } catch (error) {
            logError(`Failed to save stats file with error: ${error.message}`);
        }
    }//Final sendAnnouncement()


    //================================================================
    async messageHandler(message){
        //Handler filter
        if(message.author.bot) return;
        if(message.guild && message.guild.id !== this.config.guild) return;

        //Block banned sites/words
        if(this.config.bannedStrings.filter((w) => message.content.includes(w)).length){
            logError(`${message.author.tag} posted a blocked link:`);
            logWarn(message.content);
            message.delete().catch(()=>{
                logError(`Failed to delete message: ${message.id}`);
            })
            return message.reply(`my dude, that's a blocked site!!!`);
        }

        //Handler selection
        if(message.deleted){
            this.handlers.deleted(message, this);

        }else if(message.channel.id == this.config.channels.recommendedBuild.channel){
            this.handlers.recommendedBuild(message, this);

        }else if(message.channel.id == this.config.channels.showYourWork){
            this.handlers.showYourWork(message, this);

        }else if(message.channel.type == 'dm'){
            this.handlers.directMessages(message, this);

        }else if(message.channel.type == 'text'){
            this.handlers.general(message, this);

        }else{
            logWarn(`HandlerNotFound for message from ${message.author.tag} in ${message.channel.name} (${message.channel.type})`);
        }
    }

} //Fim txChungus()
