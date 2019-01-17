// That's all the data fetching and data updating you should ever need.
import { CAPI_fetch, CAPI_update, EDSM_fetch } from '../api/api';

// Import all the needed settings and utilities for your script.
import { timeToUpdate } from '../utils';
import { LOCALE, TIMEZONE } from '../settings';

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
			CAPI_fetch('lastApiUpdate'),	// data[0]
			CAPI_fetch('systems'),			// data[1]
			CAPI_fetch('bodies')			// data[2] ... etc
		]);

		let lastUpdate = data[0][0]; // This is an array containing only one entry - see capi_get.js : lastApiUpdate
		let systems = data[1];
		let bodies = data[2];

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

		console.log('+ SYSTEMS');
		console.log('   Total: ', systems.length);
		console.log('   Candidates for update: ', systemsToUpdate.length);

		console.log('');

		console.log('+ BODIES');
		console.log('   Total: ', bodies.length);
		console.log('   Candidates for update: ', bodiesToUpdate.length);

		console.log('');

		console.log('+ ROUGH TIME TO UPDATE');
		console.log('   [ systems ] '+timeToUpdate(systemsToUpdate, [])+'+ min' );
		console.log('   [ systems:force ] '+timeToUpdate(systems, [])+'+ min' );
		console.log('   [ bodies ] '+timeToUpdate([], bodiesToUpdate)+'+ min' );
		console.log('   [ bodies:force ] '+timeToUpdate([], bodies)+'+ min' );


		UI_h2('Last update');
		if(lastUpdate) {

			let lastUpdateDate = new Date(lastUpdate.updateTime).toLocaleString(LOCALE, { timeZone: TIMEZONE });

			console.log('');
			UI_singleHr();
			console.log('');
	
			console.log('> LAST UPDATE');
			console.log('Timedate: '+lastUpdateDate+' ['+TIMEZONE+']');
			console.log('Forced: '+lastUpdate.forced);
	
			console.log('');
			console.log('Updated Systems: '+lastUpdate.systemsUpdated.length);
			console.log(lastUpdate.systemsUpdated);
	
			console.log('');
			console.log('Updated Bodies: '+lastUpdate.bodiesUpdated.length);
			console.log(lastUpdate.bodiesUpdated);

		} else {
			console.log('No last update found.')
		}

		// Finish your script with resolve(true).
		resolve(true);
	});
	// There should be nothing after the above line.
}