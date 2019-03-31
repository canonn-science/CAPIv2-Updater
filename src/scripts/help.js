
import SCRIPTS from './index';

import { 
	UI_h2
} from '../ui.js';

export default function helpScript(runtime) {
	return new Promise(async function(resolve,reject) {

		console.log('Help for CAPI Updater.');

		UI_h2('Updater scripts available:');
		console.log('Usage: "npm run updater [script;filters]" ');
		Object.keys(SCRIPTS).forEach( key => {
			let script = SCRIPTS[key];
			console.log('  [ '+script.runArgument+' ]');
		});

		UI_h2('Available filters:');
		console.log('DO NOT USE SPACES IN FILTERS');
		console.log();
		console.log('  ;force - force the update for this script');
		console.log('  ;[id,id,...] - pass a list of "ids" to the script (runtime.ids)');
		console.log('  ;{key:value,key:value,...} - pass a key:value pair to scripts (runtime.params)');

		UI_h2('Examples:');
		console.log('  " npm run updater help "');
		console.log('  " npm run updater status "');
		console.log('  " npm run updater systems;force bodies;[25,33] "');
		console.log('  " npm run updater BTReports;force;[7,22] "');

		resolve(true);
	});
}