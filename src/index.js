require('dotenv').config();

import ScriptManager from './ScriptManager';
import { authenticate } from './api/canonn/canonn';
import Update from './UpdateManager';

/*
// NOT YET IMPLEMENTED
var UPDATE = {

	// These properties get automatically filled
	// Do NOT update them manually.
	runArgs: [],
	forceUpdate: false,
	lastUpdate: {},
	errors: []
}
export { UPDATE };
*/

console.log('');
console.log('========================================================');
console.log('');
console.log('                Canonn CAPI Updater');
console.log('');
console.log('                  Version: 0.97.0');
console.log('');
console.log('========================================================');
console.log('');


authenticate(process.env.API_USERNAME, process.env.API_PASSWORD).then( async (token) => {

	if(!token) {
		console.log('[ERROR] LOGIN FAILED, EXITING...');
		process.exit();
	}

	// Save runtime in log.
	Update.runtime = process.argv.join(' ');

	// Find and queue scripts to run.
	// First two arguments are "node" and "PATH", so we slice them away.
	ScriptManager.queueScripts( process.argv.slice(2) );

	// Run scripts in order.
	await ScriptManager.runScripts();

	// Send update log to server.
	//await Update.submit();

	// That's all folks.

});