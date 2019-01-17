/*

This file contains all the update scripts available in the updater.
Import your script file here and create a new property in SCRIPTS object.
Use 'status' as your template.

*/

import statusScript from './status';
import systemsScript from './systems';
import helpScript from './help';

const SCRIPTS = {
	'status': {

		// runtime argument that fires up this script
		runArgument: 'status',

		// script to run from /scripts/ directory, UPDATE object with all the data requested will be passed to it.
		script: statusScript
	},

	'systems': {
		runArgument: 'systems',
		script: systemsScript
	},

	'bodies': {
		runArgument: 'bodies',
		script: function() { return new Promise( (r, e) => {console.log('Just a test - updateBodies done'); r(); }) }
	},

	'BTReports': {
		runArgument: 'BTReports',
		script: function() { return new Promise( (r, e) => {console.log('Just a test - updateBTReports done'); r(); }) }
	},

	'help': {
		runArgument: 'help',
		script: helpScript
	}

}

export default SCRIPTS;