/*

This file contains all the update scripts available in the updater.
Import your script file here and create a new property in SCRIPTS object.
Use 'status' as your template.

*/

import statusScript from './status.js';

const SCRIPTS = {
	'status': {

		// runtime argument that fires up this script
		runArgument: 'status',

		// script to run from /scripts/ directory, UPDATE object with all the data requested will be passed to it.
		script: statusScript
	},

	'updateSystems': {
		runArgument: 'updateSystems',
		script: function() { return new Promise( (r, e) => {console.log('Just a test - updateSystems done'); r(); }) }
	},

	'updateBodies': {
		runArgument: 'updateBodies',
		script: function() { return new Promise( (r, e) => {console.log('Just a test - updateBodies done'); r(); }) }
	},

	'updateBTReports': {
		runArgument: 'updateBTReports',
		script: function() { return new Promise( (r, e) => {console.log('Just a test - updateBTReports done'); r(); }) }
	}

}

export default SCRIPTS;