/*

This file contains all the update scripts available in the updater.
Import your script file here and create a new property in SCRIPTS object.
Use 'status' as your template.

*/

import statusScript from './status';
import systemsScript from './systems';
import bodiesScript from './bodies';
import helpScript from './help';

import generateReports from './generateReports';

import resetBTReportStatus from './resetBTReportStatus';
import btReports2btSitesScript from './BTReports2BTSites';

//import site_from_reportScript from './site_from_report';

import testScript from './test';

const SCRIPTS = {
	'status': {

		// runtime argument that fires up this script
		runArgument: 'status',

		// script to run from /scripts/ directory, UPDATE object with all the data requested will be passed to it.
		script: statusScript,

		// should this script be run when updater is run with 'npm run updater !runall'
		runAll: false
	},

	'systems': {
		runArgument: 'systems',
		script: systemsScript,
		runAll: true
	},

	'bodies': {
		runArgument: 'bodies',
		script: bodiesScript,
		runAll: true
	},

	/*'site_from_report': {
		runArgument: 'site_from_report',
		script: site_from_reportScript,
		runAll: false
	},*/

		// Remove when report2site works
		'btreports2btsites': {
			runArgument: 'btreports2btsites',
			script: btReports2btSitesScript,
			runAll: true
		},

		// For testing only
		'generatereports': {
			runArgument: 'generatereports',
			script: generateReports,
			runAll: false
		},

		// For manual use only
		'resetbtreportstatus': {
			runArgument: 'resetbtreportstatus',
			script: resetBTReportStatus,
			runAll: false
		},

	'help': {
		runArgument: 'help',
		script: helpScript,
		runAll: false
	},

		// For testing only
		'test': {
			runArgument: 'test',
			script: testScript,
			runAll: false
		}

}

export default SCRIPTS;