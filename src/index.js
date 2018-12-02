import 'dotenv/config';

import { authenticate } from './api/canonn.js';
import { EDSM_DELAY, EDSM_MAX_CALL_STACK } from './settings.js';

import { 
	queueUpdates,
	updateBodies
} from './updater.js';

import {
	pullAPIData,
	timeToUpdate
} from './functions.js';

/* Run arguments */
const runArgs = [];
var forceUpdate = false;

var systems = [];
var systemsToUpdate = [];

var bodies = []
var bodiesToUpdate = [];

/* Script start */
console.log('');
console.log('EDSM => Canonn API updater.');
console.log('');
console.log('============================================');

process.argv.forEach(function (val, index, array) {
	runArgs.push(val);
});


console.log('Checking Canonn API status:');
console.log('');

pullAPIData().then( result => {

	systems = result.systems;
	systemsToUpdate = result.systemsUpdate;

	bodies = result.bodies;
	bodiesToUpdate = result.bodiesUpdate;

	if( runArgs.indexOf('status') != -1 ) {
		console.log('-------------------------------------');
		/*console.log('+ LAST UPDATE (if we have the meta I mentioned)');
		console.log('   When: TIMESTAMP');
		console.log('   Forced: FALSE');
		console.log('   Updated Systems: INT');
		console.log('   Updated Bodies: INT');
		console.log('');*/
		console.log('+ SYSTEMS');
		console.log('   Total: ', systems.length);
		console.log('   Candidates for update: ', systemsToUpdate.length);
		console.log('')
		console.log('+ BODIES');
		console.log('   Total: ', bodies.length);
		console.log('   Candidates for update: ', bodiesToUpdate.length);
		console.log('');
		console.log('+ ROUGH TIME TO UPDATE');
		console.log('   (update candidates)' );
		console.log('   updateSystems: '+timeToUpdate(systemsToUpdate, [])+'+ min' );
		console.log('   updateBodies: '+timeToUpdate([], bodiesToUpdate)+'+ min' );
		console.log('   updateAll: '+timeToUpdate(systemsToUpdate, bodiesToUpdate)+'+ min' );
		console.log('')
		console.log('   + forceUpdate (update all systems/bodies)');
		console.log('   updateSystems: '+timeToUpdate(systems, [])+'+ min' );
		console.log('   updateBodies: '+timeToUpdate([], bodies)+'+ min' );
		console.log('   updateAll: '+timeToUpdate(systems, bodies)+'+ min' );
		console.log('-------------------------------------');

	} else {

		if( runArgs.indexOf('forceUpdate') != -1 ) {
			forceUpdate = true;
	
			console.log('[WARNING] forceUpdate triggered. ALL Systems and/or ALL Bodies will be updated (regardless of their status).');
			console.log('');
		}
	
		if( runArgs.indexOf('updateAll') != -1 ) {
	
			authenticate(process.env.API_USERNAME, process.env.API_PASSWORD).then( (token) => {

				var keySystemsArray = [];
				var keyBodiesArray = [];
		
				if(forceUpdate) {
	
					console.log('');
					console.log('Updating ALL Systems ['+result.systems.length+'] and ALL Bodies ['+result.bodies.length+']');
					console.log('Approximate time to finish: '+timeToUpdate(result.systems, result.bodies)+' min' );
					console.log('');
	
				} else {
	
					console.log('');
					console.log('Updating ['+result.systemsUpdate.length+'] Systems and ['+result.bodiesUpdate.length+'] Bodies.');
					console.log('Approximate time to finish: '+timeToUpdate(result.systemsUpdate, result.bodiesUpdate)+' min' );
					console.log('');
	
					queueUpdates('bodies', bodiesToUpdate, updateBodies).then( r=> {
						console.log('Bodies complete, proceeding to systems');
						//queueUpdates('systems', systemsToUpdate, updateSystems);
					});
	
				}

	
			});
			
		} else if( runArgs.indexOf('updateSystems') != -1 ) {
	
			authenticate(process.env.API_USERNAME, process.env.API_PASSWORD).then( (token) => { 
	
				console.log('[i] Updating all Systems that are considered for update.');
			});
			
		} else if( runArgs.indexOf('updateBodies') != -1 ) {
	
			authenticate(process.env.API_USERNAME, process.env.API_PASSWORD).then( (token) => {
	
				console.log('[i] Updating all Bodies that are considered for update.');
			});
			
		} else {
			console.log('[ERROR] Unrecognized command, try: npm run [status, updateSystems, updateBodies, updateAll]');
		}

	}

});
