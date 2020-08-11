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
            this.client.user.setActivity('you idiots', {type: 'WATCHING'});
            this.announceChannel = await this.client.channels.resolve(this.config.announceChannel);
            if(!this.announceChannel){
                logError(`Announcements channel not found: ${this.config.announceChannel}`);
            }
            const outMsg = new Discord.MessageEmbed({
                color: 0x4287F5,
                // description: `People just kind of associate me with kicking some ass.`
                description: `Honestly? Mee6 is just a lil bitch...`
            });
            this.sendAnnouncement(outMsg);
        });
        this.client.on('message', this.handleMessage.bind(this));
        this.client.on('messageDelete', this.handleMessageDeleted.bind(this));
        this.client.on('error', (error) => {
            logError(error.message);
        });
        this.client.on('resume', (error) => {
            logOk('Connection with Discord API server resumed');
            this.client.user.setActivity('you idiots', {type: 'WATCHING'});
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
            !this.config.announceChannel ||
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
    async handleMessage(message){
        //Keep recommendation channel clean
        if(
            !message.content.startsWith(this.config.prefix + 'iuse ') &&
            message.channel.id == this.config.commands.recommendedBuild.channel &&
            message.author.id !== message.client.user.id
        ){
            message.delete().catch(()=>{
                logError(`Failed to delete message: ${message.id}`);
            })
        }

        //Handler filter
        if(message.author.bot) return;
        if(message.guild && message.guild.id !== this.config.guild) return;
        if(message.channel.type !== 'text'){
            return message.reply(`Yoo dude... how about no DMs??? Use the #help channel!`);
        }
        if(!message.content.startsWith(this.config.prefix)) return;

        //Parse message & gets command
        const args = message.content.slice(this.config.prefix.length).split(/\s+/);
        const commandName = args.shift().toLowerCase();
        const command = GlobalData.commands.get(commandName) 
                        || GlobalData.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        //Check if the command exists
        if (!command) return;

        //Logs, adds to the stats
        log(`[${message.author.tag}] ${message.content}`);
        this.addUsageStats(commandName);

        //Executes command
        try {
            command.execute(message, args, this.config.commands);
        } catch (error) {
            logError(`Error executing ${commandName}: ${error.message}`);
        }
    }


    //================================================================
    async handleMessageDeleted(message){
        if(message.author.bot) return;
        logWarn(`[deleted][${message.author.tag}] ${message.content}`)
    }


} //Fim txChungus()
