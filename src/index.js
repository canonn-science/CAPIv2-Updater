import 'dotenv/config';

import { authenticate } from './api/canonn.js';
import { EDSM_DELAY, EDSM_MAX_CALL_STACK } from './settings.js';

import { 
	queueUpdates,
	updateBodies,
	updateSystems
} from './updater.js';

import {
	pullAPIData,
	timeToUpdate,
	parseArgArray
} from './functions.js';

import {
	UPDATE_STATUS,
	UPDATE_ALL,
	UPDATE_SYSTEMS,
	UPDATE_BODIES,
	UPDATE_FORCE
} from './settings.js';

/* Run arguments */
const runArgs = [];
var forceUpdate = false;

var systems = [];
var systemsToUpdate = [];

var bodies = [];
var bodiesToUpdate = [];

/* Script start */
console.log('');
console.log('EDSM => Canonn API updater.');
console.log('');
console.log('============================================');

process.argv.forEach(function (val, index, array) {
	runArgs.push(val);
});

// Override systems/bodies to update from command line.
const updateOverride = parseArgArray(runArgs);

console.log('Checking Canonn API status:');
console.log('');

pullAPIData().then( result => {

	systems = result.systems;
	systemsToUpdate = result.systemsUpdate;

	bodies = result.bodies;
	bodiesToUpdate = result.bodiesUpdate;


	if( runArgs.indexOf(UPDATE_STATUS) != -1 ) {
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
		console.log('');
		console.log('+ BODIES');
		console.log('   Total: ', bodies.length);
		console.log('   Candidates for update: ', bodiesToUpdate.length);
		console.log('');
		console.log('+ ROUGH TIME TO UPDATE');
		console.log('   (update candidates)' );
		console.log('   updateSystems: '+timeToUpdate(systemsToUpdate, [])+'+ min' );
		console.log('   updateBodies: '+timeToUpdate([], bodiesToUpdate)+'+ min' );
		console.log('   updateAll: '+timeToUpdate(systemsToUpdate, bodiesToUpdate)+'+ min' );
		console.log('');
		console.log('   + forceUpdate (update all systems/bodies)');
		console.log('   updateSystems: '+timeToUpdate(systems, [])+'+ min' );
		console.log('   updateBodies: '+timeToUpdate([], bodies)+'+ min' );
		console.log('   updateAll: '+timeToUpdate(systems, bodies)+'+ min' );
		console.log('-------------------------------------');

	} else {

		if( runArgs.indexOf(UPDATE_SYSTEMS) !== -1 	||
			runArgs.indexOf(UPDATE_BODIES) !== -1 	||
			runArgs.indexOf(UPDATE_ALL) !== -1
		) {

			authenticate(process.env.API_USERNAME, process.env.API_PASSWORD).then( (token) => {

				// check for force update

				if( runArgs.indexOf(UPDATE_FORCE) !== -1 ) {
					console.log('[WARNING] forceUpdate triggered. ALL Systems and/or ALL Bodies will be updated (regardless of their status).');
					console.log('');

					systemsToUpdate = systems;
					bodiesToUpdate = bodies;

					forceUpdate = true;
				}

				// check for run parameters systems=[], bodies=[]

				if(updateOverride.systems.length > 0) {

					console.log('');
					console.log('[WARNING] Systems override from runtime:');

					systemsToUpdate = updateOverride.systems.reduce( (foundArray, systemId) => {

						let found = false;

						systems.forEach( system => {

							if( system.id  == systemId ) {
								console.log(' [Ok...] ID: '+systemId+' found as: '+system.systemName);
								foundArray.push(system);
								found = true;
							}

						});

						if(!found) {
							console.log(' [ERROR] ID: '+systemId+' not found in Canonn API');
						}

						return foundArray;

					}, []);

					console.log('');

				}

				if(updateOverride.bodies.length > 0) {

					console.log('');
					console.log('[WARNING] Bodies override from runtime:');
			
					bodiesToUpdate = updateOverride.bodies.reduce( (foundArray, bodyId) => {
			
						let found = false;
			
						bodies.forEach( body => {
			
							if( body.id  == bodyId ) {
								console.log(' [Ok...] ID: '+bodyId+' found as: '+body.bodyName);
								foundArray.push(body);
								found = true;
							}
			
						});
			
						if(!found) {
							console.log(' [ERROR] ID: '+bodyId+' not found in Canonn API');
						}
			
						return foundArray;
			
					}, []);
			
					console.log('');
			
				}

				// Main script loop
				// updateSystems
				// updateBodies
				// updateAll

				if( runArgs.indexOf(UPDATE_ALL) !== -1 ) {

					console.log('');
					console.log('[i] Updating ['+systemsToUpdate.length+'] Systems and ['+bodiesToUpdate.length+'] Bodies');
					console.log('Approximate time to finish: '+timeToUpdate(systemsToUpdate, bodiesToUpdate)+' min' );
					console.log('');

					queueUpdates('bodies', bodiesToUpdate, updateBodies).then( r=> {
						console.log('');
						console.log('~~~~ Bodies complete, proceeding to Systems');
						console.log('');

						queueUpdates('systems', systemsToUpdate, updateSystems);
					});

				} else if( runArgs.indexOf(UPDATE_SYSTEMS) !== -1 ) {

					console.log('');
					console.log('[i] Updating ['+systemsToUpdate.length+'] Systems.');
					console.log('Approximate time to finish: '+timeToUpdate(systemsToUpdate, [])+' min' );
					console.log('');

					queueUpdates('systems', systemsToUpdate, updateSystems);

				} else if( runArgs.indexOf(UPDATE_BODIES) !== -1 ) {

					console.log('[i] Updating ['+bodiesToUpdate.length+'] Bodies.');
					console.log('Approximate time to finish: '+timeToUpdate([], bodiesToUpdate)+' min' );
					console.log('');

					queueUpdates('bodies', bodiesToUpdate, updateBodies);

				}

			});

		// No known script runtime mode passed
		} else {
			console.log('');
			console.log('============================================');
			console.log('Unknown runtime mode. Try: '+UPDATE_SYSTEMS+', '+UPDATE_BODIES+' or '+UPDATE_ALL);
			console.log('============================================');
		}
	}

});
