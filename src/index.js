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
console.log('============================================');
console.log('Canonn CAPI updater script.');
console.log('============================================');
console.log('');


authenticate(process.env.API_USERNAME, process.env.API_PASSWORD).then( (token) => {

	if(!token) {
		console.log('[ERROR] LOGIN FAILED, EXITING...');
		return null;
	}

	// Find and queue scripts to run
	// First two arguments are "node" and "PATH", so we slice them away.
	ScriptManager.queueScripts( process.argv.slice(2) );

	// Run scripts in order
	ScriptManager.runScripts();

});