
import SCRIPTS from './index';
import CAPI_GET from '../api/canonn/capi_get';

import { 
	UI_header, 
	UI_footer, 
	UI_h2,
	UI_singleHr
} from '../ui.js';

export default function helpScript(runtime) {
	return new Promise(async function(resolve,reject) {

		console.log('Help for CAPI Updater.');

		UI_h2('Updater scripts available:');
		console.log('Usage: "npm run updater [script:filters]" ');
		Object.keys(SCRIPTS).forEach( key => {
			let script = SCRIPTS[key];
			console.log('  [ '+script.runArgument+' ]');
		});

		UI_h2('Available filters:');
		console.log('  :force - force the update for this script');
		console.log('  :[id,id,...] - only update entries with ids specified');

		UI_h2('Examples:');
		console.log('  " npm run updater help "');
		console.log('  " npm run updater status "');
		console.log('  " npm run updater systems:force bodies:[25,33] "');
		console.log('  " npm run updater BTReports:force:[7,22] "');

		resolve(true);
	});
}