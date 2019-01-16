import SCRIPTS from './scripts/index.js';

import { UI_header, UI_footer } from './ui.js';
/*

This is the manager for all the scripts run via updater.

- parse updater run arguments and queue scripts
- run scripts synchronously
- TODO: control error reporting and apiupdates log
- TODO: sync data across scripts, so each script doesn't pull the same data

*/

const ScriptManager = {

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
	
			UI_header('Running script ['+doneScripts+'/'+totalScripts+']: '+script.type);
			await script.fn(script.runtime);
			UI_footer('Script ['+doneScripts+'/'+totalScripts+'] finished.');

			this.scriptsCompleted.push(script);

			resolve();

		});

	},

	runScripts: async function() {

		for( const script of this.scriptsToRun ) {
			await this.run( script );
		}

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

	runtimeArguments.forEach( arg => {

		let scriptName = arg.split(':')[0];
		let argumentModifiers = arg.split(':').slice(1);

		if( SCRIPTS[scriptName] ) {

			let scriptObject = {
				type: scriptName,
				fn: SCRIPTS[scriptName].script,
				runtime: {
					force: false,
					ids: false
				}
			}

			argumentModifiers.forEach( mod => {

				if(mod == 'force') {
					scriptObject.runtime.force = true;
				}

				// Please someone help with the regexp :P
				if( mod.indexOf('[') !== -1 && mod.indexOf(']') !== -1 ) {
					scriptObject.runtime.ids = mod.replace('[','').replace(']','').split(',');
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