import 'dotenv/config';

import ScriptManager from './ScriptManager.js';

import { authenticate } from './api/canonn.js';
import { CAPI_fetch } from './api/api.js';

import {
	timeToUpdate,
	parseArgArray
} from './utils.js';

// nodes (systems, sites, bodies, etc.) to be updated
// this is based on runtime arguments
// you can also manually add nodeName to this list and the script will update them

// new update object
// contains all the data needed to run the script
// it gets dynamically filled with data based on API nodes
// this object can be updated during script run

// NODE - type you want to update, for example: systems, bodies, sites, reports, etc
// the format for all nodes is as follows:
//	
//	nodeName: {
//		all: [] 				// All instances for this node (eg. all bodies/sites/etc.)
//		updateCandidates: []	// You should .filter(validationFunction) all instances based on a validation function
//		skipped: []				// If some update candidates are skipped (eg. missingSkipCount, or any other condition) you should place them here
//		errors: []				// Use reportError('nodeName', error) to add errors to this node. They will be uploaded to Canonn API updateLog
//  }
//

var UPDATE = {

	// These properties get automatically filled
	// Do NOT update them manually.
	runArgs: [],
	forceUpdate: false,
	lastUpdate: {},
	errors: []
}
export { UPDATE };

// Script intro
// some basic setings and argument parsing

console.log('');
console.log('============================================');
console.log('Canonn CAPI updater script.');
console.log('============================================');
console.log('');

// Find and queue scripts to run
// First two arguments are "node" and "PATH", so we slice them away.
ScriptManager.queueScripts( process.argv.slice(2) );
ScriptManager.runScripts();



/*CAPI_fetch('systems');

CAPI_fetch('systems', {
	where: {
		"systemName": "Sol"
	}
});*/


