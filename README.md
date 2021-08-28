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



## Permissions required:
https://discordapi.com/permissions.html#201681986

## systemd
```bash
nano /etc/systemd/system/txchungus.service
systemctl daemon-reload
systemctl enable txchungus.service
systemctl start txchungus.service
alias chunguslog='journalctl -fu txchungus --output cat -n 500'
```

```conf
[Unit]
Description=txChungus Service
After=network.target

[Service]
Type=simple
Restart=always
RestartSec=1
User=<your thing>
WorkingDirectory=/home/<your thing>/txChungus
ExecStart=/usr/bin/env FORCE_COLOR=3 node index.js prod

[Install]
WantedBy=multi-user.target
```

## License
This work is licensed under a [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License](http://creativecommons.org/licenses/by-nc-sa/4.0/).


## (just some notes, plz ignore, thanks)
Clean hoisters and unicode:
https://lingojam.com/StylishTextGenerator

https://matrix.to/#/!rUiwxlJvpdAOiTowFn:cfx.re/$uQDKLJYO9wkohmnVLNrj-c24OPQv8jOVcCTlZ_QCrlo?via=cfx.re&via=matrix.org&via=kng.re
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize

> 'Amélie'.normalize('NFD').replace(/[^\x00-\x7F]/g, '')
'Amelie'

> '𝓬𝓸𝓹𝔂'.normalize('NFKD').replace(/[^\x00-\x7F]/g, '')
'copy'

> 'Amélie'.normalize('NFKD').replace(/[^\p{L}]/gu, '')
'Amelie'
> 'блять'.normalize('NFKD').replace(/[^\p{L}]/gu, '')
'блять'

> '𝓬𝓸𝓹𝔂 блять 69 wew'.normalize('NFKD').replace(/[^\p{L}\p{N} ]/gu, '')
'copy блять 69 wew'


https://api.urbandictionary.com/v0/define?term=xxxxxxxxxxx
https://api.urbandictionary.com/v0/random
