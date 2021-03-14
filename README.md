<p align="center">
	<h1 align="center">
		txChungus
	</h1>
	<h4 align="center">
        <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/"><img src="https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg" alt="License: CC BY-NC-SA 4.0"></img></a>
        &nbsp;
		<a href="https://discord.gg/f3TsfvD"><img src="https://discordapp.com/api/guilds/577993482761928734/widget.png?style=shield"></img></a>
	</h4>
	<p align="center">
		Just a random offensive discord bot to do some crap that a bunch of other bots can do but i'm too lazy to look for 🤷‍♂️.
	</p>
    <p align="center">
		<b>
			This code was written by multiple people, none of them had remotely any regards for code quality. <br> 
			Therefore, I have zero intentions to keep this updated and working.
		</b> 
	</p>
</p>

<br/>


## Commands:
### Dynamic
- `!artifact`: Link to the artifacts page with cache busting;
- `!destroy`: Extremely rude, don't use this!
- `!help`: Lists all the registered commands
- `!insult`: Insults someone;
- `!latest full`: prints the json response from both fxserver versions API;
- `!latest`: prints txAdmin and fxserver latest versions, with instructions to install txAdmin (if needed) and the links to the fxserver artifacts page  with cachebusting every ~33 minutes;
- `!m8b`: The Magic 8 Ball will answer your YES/NO question;
- `!mock`: Mocks an member profile picture
- `!prune`: Prunes the chat;
- `!when`: Tells you when something will happen;
- `!pick`: Picks between many options;
- 🤷‍♂️ maybe more? i probably forgot to update this list

### Static:
(those are just the macros I have on my discord server)
```
300, admin, api, args, ask, bitch, bot, cache, cause, chan, clock, convars, docs, down, dual, endpoints, events, fivem, linux, localhost, logs, plume, quickedit, ram, read, scss, structure, support, t, task5, translate, txdata, vc, whitelist, zap
```

## TODO:
- [x] commands/pick.js: change text and regex
- [x] lib/txChungus.js:setupData(): remove method declaration
- [x] events/guildMemberAdd.js: use role id in settings, remove the rude message
- [x] events/guildMemberAdd.js: where messages go?
- [ ] lib/handlers/general.js: not sure about this rate limiter... those timeouts seem a bit weird
- *[ ] commands/mute.js: fix weird regex
- [x] commands/mute.js: use role id in settings
- [x] commands/mute.js: change mute message
- [x] commands/unmute.js: change messages/description


- passar prettier em tudo

Pra onde isso foi?

//Block banned sites/words
if(this.config.bannedStrings.filter((w) => message.content.includes(w)).length){
    logError(`${message.author.tag} posted a blocked link:`);
    logWarn(message.content);
    message.delete().catch(()=>{});
    return message.reply(`my dude, that's a blocked site!!!`);
}

## Permissions required:
https://discordapi.com/permissions.html#201681986

## License
This work is licensed under a [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License](http://creativecommons.org/licenses/by-nc-sa/4.0/).
