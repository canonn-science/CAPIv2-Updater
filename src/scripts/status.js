// That's all the data fetching and data updating you should ever need.
import { CAPI_fetch, CAPI_update, EDSM_fetch } from '../api/api';

// Import all the needed settings and utilities for your script.
import { timeToUpdate } from '../utils';
import { LOCALE, TIMEZONE, REPORT_STATUS } from '../settings';

// Import validators you use in the script.
// TODO: This will later be unified into validate();
import validateSystem from '../validators/system';
import validateBody from '../validators/body';

// Import UI console printers for consistent script look
import { 
	UI_header, 
	UI_footer, 
	UI_h2,
	UI_singleHr
} from '../ui';


// Export your script
// Make sure it's an async function and it's wrapped with a Promise
export default function statusScript(runtime) {

	// Make sure you use a promise for the script code.
	// You can reject it at any time, but remember to resolve it at the end of the function
	return new Promise(async function(resolve,reject) {

		// This is your script logic, implement everything you need inside this function.
		// runtime argument here has all the command line parameters used at updater run
		// Uncomment the line below to see what's inside.
		//console.log('(i) Runtime: ', runtime);

		UI_h2('Fetching Data.');

		// Grab your data from CAPI
		// Use await to make the API calls synchronous inside this script
		// If you have more than one fetch use await Promise.all([ CAPI_fetch(...), CAPI_fetch(...), ...])

		let data = await Promise.all([
			CAPI_fetch('lastApiUpdate'),
			CAPI_fetch('systems'),
			CAPI_fetch('bodies'),

			CAPI_fetch('bmsites'),
			CAPI_fetch('bmreports'),

			CAPI_fetch('btsites'),
			CAPI_fetch('btreports'),

			CAPI_fetch('cssites'),
			CAPI_fetch('csreports'),

			CAPI_fetch('fgsites'),
			CAPI_fetch('fgreports'),

			CAPI_fetch('fmsites'),
			CAPI_fetch('fmreports'),

			CAPI_fetch('gvsites'),
			CAPI_fetch('gvreports'),

			CAPI_fetch('gysites'),
			CAPI_fetch('gyreports'),

			CAPI_fetch('lssites'),
			CAPI_fetch('lsreports'),

			CAPI_fetch('twsites'),
			CAPI_fetch('twreports')

		]);

		let lastUpdate 	= 	data[0][0]; // This is an array containing only one entry - see capi_get.js : lastApiUpdate
		let systems 	= 	data[1];
		let bodies 		= 	data[2];

		let sitesReports = [
			{
				name: '[BM] Bark Mounds',
				sites: data[3],
				reports: data[4]
			},
			{
				name: '[BT] Brain Trees',
				sites: data[5],
				reports: data[6]
			},
			{
				name: '[CS] Crystaline Shards',
				sites: data[7],
				reports: data[8]
			},
			{
				name: '[FG] Fungal Gourds',
				sites: data[9],
				reports: data[10]
			},
			{
				name: '[FM] Fumaroles',
				sites: data[11],
				reports: data[12]
			},
			{
				name: '[GV] Gas Vents',
				sites: data[13],
				reports: data[14]
			},
			{
				name: '[GY] Geysers',
				sites: data[15],
				reports: data[16]
			},
			{
				name: '[LS] Lava Sprouts',
				sites: data[17],
				reports: data[18]
			},
			{
				name: '[TW] Tube Worms',
				sites: data[19],
				reports: data[20]
			}

		];


		// Example of using validators to chech which systems/bodies need updating
		// TODO: Move this to validator once its done
		let systemsToUpdate = systems.filter(validateSystem);
		let bodiesToUpdate = bodies.filter(validateBody);

		// Local script variables setup
		let currentDate = new Date().toLocaleString(LOCALE, { timeZone: TIMEZONE });

		// Script body
		// Do stuff here.

		UI_h2('Canonn Updater CAPIv2 Status:');
		console.log(currentDate+' ['+TIMEZONE+']');
		
		UI_singleHr();

		UI_h2('-> SYSTEMS');
		console.log('   Total: ', systems.length);
		console.log('   Candidates for update: ', systemsToUpdate.length);

		console.log('');

		UI_h2('-> BODIES');
		console.log('   Total: ', bodies.length);
		console.log('   Candidates for update: ', bodiesToUpdate.length);

		console.log('');

		sitesReports.forEach( sr => {

			let pending = sr.reports.filter( r => {
				return r.reportStatus == REPORT_STATUS.pending;
			})

			UI_h2('-> '+sr.name);
			console.log('   Sites:     '+sr.sites.length);
			console.log('   Reports:   '+sr.reports.length);
			console.log('   Pending:   '+pending.length);

		});

		/*console.log('+ ROUGH TIME TO UPDATE');
		console.log('   [ systems ] '+timeToUpdate(systemsToUpdate, [])+'+ min' );
		console.log('   [ systems:force ] '+timeToUpdate(systems, [])+'+ min' );
		console.log('   [ bodies ] '+timeToUpdate([], bodiesToUpdate)+'+ min' );
		console.log('   [ bodies:force ] '+timeToUpdate([], bodies)+'+ min' );*/

		console.log('');
		UI_h2('-> LAST UPDATE');
		if(lastUpdate) {

			let lastUpdateDate = new Date(lastUpdate.updateTime).toLocaleString(LOCALE, { timeZone: TIMEZONE });

			console.log('');
			UI_singleHr();
			console.log('');
	
			console.log('> LAST UPDATE');
			console.log('Timedate: '+lastUpdateDate+' ['+TIMEZONE+']');
	
			console.log();
			console.log('DUMP:');
			console.log(lastUpdate.updateLog);

		} else {
			console.log('No last update found.')
		}

		// Finish your script with resolve(true).
		resolve(true);
	});
	// There should be nothing after the above line.
}