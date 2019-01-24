/*

This file contains all the update scripts available in the updater.
Import your script file here and create a new property in SCRIPTS object.
Use 'status' as your template.

*/

import statusScript from './status';
import systemsScript from './systems';
import bodiesScript from './bodies';
import helpScript from './help';
import btReports2btSitesScript from './BTReports2BTSites';
import generateBTReports from './generateBTReports';

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
		script: bodiesScript
	},

	'btreports2btsites': {
		runArgument: 'btreports2btsites',
		script: btReports2btSitesScript
	},

		// For testing only
		'generatebtreports': {
			runArgument: 'generatebtreports',
			script: generateBTReports
		},

	'help': {
		runArgument: 'help',
		script: helpScript
	}

}

export default SCRIPTS;