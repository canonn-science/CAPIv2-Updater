import 'dotenv/config';

import ScriptManager from './ScriptManager';

import { authenticate } from './api/canonn/canonn';
import { CAPI_fetch } from './api/api';

import {
	timeToUpdate,
	parseArgArray
} from './utils';

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

// Find and queue scripts to run
// First two arguments are "node" and "PATH", so we slice them away.
ScriptManager.queueScripts( process.argv.slice(2) );
ScriptManager.runScripts();


