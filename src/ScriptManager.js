import SCRIPTS from './scripts/index';

import { UI_header, UI_footer } from './ui';

/*

This is the manager for all the scripts run via updater.

- parse updater run arguments and queue scripts
- run scripts synchronously
- TODO: control error reporting and apiupdates log
- TODO: sync data across scripts, so each script doesn't pull the same data

*/

const ScriptManager = {

    activeScript: null,
    scriptsToRun: [],
    scriptsCompleted: [],

    // Queues scripts based on runtime arguments
    queueScripts: function(runtimeArguments) {
        this.scriptsToRun = parseArguments(SCRIPTS, runtimeArguments);
    },

    run: function(script) {

        return new Promise( async (resolve, reject) => {

            let totalScripts = this.scriptsToRun.length;
            let doneScripts = this.scriptsCompleted.length+1;

            this.activeScript = script;
    
            UI_header('SCRIPT MANAGER: Running ['+doneScripts+'/'+totalScripts+']: "'+script.type+'"');

            await script.fn(script.runtime);

            console.log('');
            UI_footer('SCRIPT MANAGER: ['+doneScripts+'/'+totalScripts+'] "'+script.type+'" finished.');
            console.log('');

            this.scriptsCompleted.push(script);
            this.activeScript = null;

            resolve();

        }).catch( function(e) {
            console.log('ScriptManager error: ', e);
        });

    },

    runScripts: async function() {
        return new Promise( async (resolve, reject) => {

            if( this.scriptsToRun.length < 1 ) {
    
                this.scriptsToRun.push({
                    type: 'help',
                    fn: SCRIPTS.help.script,
                    runtime: {
                        force: false,
                        ids: false
                    }
                });
    
            }
    
            for( const script of this.scriptsToRun ) {
                await this.run( script );
            }

            resolve();

        });

    }

}

export default ScriptManager;

/* 
-------------------------------------------------
Internal functions - don't use outside this file. 
-------------------------------------------------
*/

// Parses runtime arguments for scriptManager.queueScripts
// And creates script run object with settings and script function to run.

function parseArguments(scripts, runtimeArguments) {

    const scriptObjects = [];
    const splitter = ':';

    runtimeArguments.forEach( arg => {

        let scriptName = arg.split(splitter)[0];

        // Regex thanks to AdmlAdama. :)

        let regex = /:\[([^\]]*)\]/gi;
        let result = null;
        let argumentModifiers = []

        while( result = regex.exec(arg) ) {
            argumentModifiers.push(result[1]);
        }

        if( SCRIPTS[scriptName] ) {

            let scriptObject = {
                type: scriptName,
                fn: SCRIPTS[scriptName].script,
                runtime: {
                    force: false,
                    ids: false,
                    params: {}
                }
            }

            argumentModifiers.forEach( mod => {

                // Detect force
                if(mod == 'force') {
                    scriptObject.runtime.force = true;
                } else {

                    let split = mod.split(',');

                    // Param is an object type: :[object:value,object2:value2,...]
                    if(mod.indexOf(':') !== -1) {

                        split.forEach( obj => {
                            let paramName = obj.split(':')[0];
                            let paramValue = obj.split(':')[1];

                            scriptObject.runtime.params[paramName] = paramValue;
                        });

                    // Param should be passed to script.runtime.ids
                    } else {
                        scriptObject.runtime.ids = split;

                    }

                }


            });

            scriptObjects.push( scriptObject );

        } else {
            console.log('');
            console.log('[ERROR]: Script for runtime argument "'+arg+'" not found. Check scripts/index.js');
            console.log('');
        }

    });

    return scriptObjects;

}