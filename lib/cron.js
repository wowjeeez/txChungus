//Requires
const modulename = 'cron';
const axios = require("axios");
const { dir, log, logOk, logWarn, logError } = require('./console')(modulename);

//Helpers
const now = () => { return Math.round(Date.now() / 1000) };
const anyUndefined = (...args) => { return [...args].some(x => (typeof x === 'undefined')) };


/**
 * txChungus bot class
 */
module.exports = class Cron {
    constructor(config) {
        this.config = config;
        log('Setting up Cron');

        this.updateChangelog('windows', true);
        this.updateChangelog('linux', true);
        setInterval(()=>{
            this.updateChangelog('windows');
            this.updateChangelog('linux');
        }, 60*1000);
    }

    //================================================================
    async updateChangelog(osType, firstTime = false){
        try {
            //perform request - cache busting every ~33m
            let osTypeApiUrl = (osType == 'windows')? 'win32' : 'linux';
            let cacheBuster = Math.floor(now() / 2e3) % 1000;
            let reqUrl = `https://changelogs-live.fivem.net/api/changelog/versions/${osTypeApiUrl}/server?${cacheBuster}`;
            let changelogReq = await axios.get(reqUrl);
    
            //check response
            if(!changelogReq.data) throw new Error('request failed');
            const changelog = changelogReq.data;
            if(anyUndefined(changelog.recommended, changelog.optional, changelog.latest, changelog.critical)){
                throw new Error('expected values not found');
            }
    
            //fill in databus
            let osTypeRepoUrl = (osType == 'windows')? 'server_windows' : 'proot_linux';
            GlobalData.fxserverVersions[osType] = {
                latest: parseInt(changelog.latest),
                optional: parseInt(changelog.optional),
                critical: parseInt(changelog.critical),
                recommended: parseInt(changelog.recommended),
                artifactsLink: `https://runtime.fivem.net/artifacts/fivem/build_${osTypeRepoUrl}/master/?${cacheBuster}`,
            }
            if(firstTime) log(`${osType} fxserver versions updated`);
        } catch (error) {
            // logWarn(`Failed to retrieve FXServer ${osType} update data with error: ${error.message}`);
            if(firstTime) dir(error)
        }
    }


    //================================================================
    async yyyyyyy(){
        //xxxx
    }

} //Fim Cron()
