import { getSystems, getBodies } from './api/canonn.js';
import validateSystem from './validators/system.js';
import validateBody from './validators/body.js';

import { EDSM_DELAY, EDSM_MAX_CALL_STACK } from './settings.js';

const systems = [];
const systemsUpdate = [];

const bodies = [];
const bodiesUpdate = [];

export function pullAPIData() {

	console.log('Fetching Systems and Bodies from Canonn API...');

	return Promise.all([ getSystems(), getBodies()] )
	.then( result => {
		systems.push(...result[0]);
		bodies.push(...result[1]);
		console.log('> ...OK');

		console.log('Validating Systems and Bodies');

		systems.forEach( system => {
			if( !validateSystem(system) ) {
				systemsUpdate.push(system);
			}
		});

		bodies.forEach( body => {
			if( !validateBody(body) ) {
				bodiesUpdate.push(body);
			}
		});
		console.log('> ...OK');

		return {
			systems: systems,
			systemsUpdate: systemsUpdate,

			bodies: bodies,
			bodiesUpdate: bodiesUpdate
		};
	});

}

// returns time in minutes
export function timeToUpdate(systems, bodies) {

	return Math.ceil( bodies.length*(EDSM_DELAY/1000)/60 ) + Math.ceil( systems.length/EDSM_MAX_CALL_STACK*(EDSM_DELAY/1000)/60 )

}