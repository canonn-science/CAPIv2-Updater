import { getSystems, getBodies } from './api/canonn.js';
import validateSystem from './validators/system.js';
import validateBody from './validators/body.js';

import { 
	EDSM_DELAY,
	EDSM_MAX_CALL_STACK,
	ARG_SYSTEMS_STRING,
	ARG_BODIES_STRING
} from './settings.js';

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

	return Math.ceil( bodies.length*(EDSM_DELAY/1000)/60 ) + Math.ceil( systems.length/EDSM_MAX_CALL_STACK*(EDSM_DELAY/1000)/60 );

}

// split an array to array-chunks of set size
export function chunkArray(array, chunk_size = EDSM_MAX_CALL_STACK){
    let index = 0;
    const arrayLength = array.length;
    let tempArray = [];
    
    for (index = 0; index < arrayLength; index += chunk_size) {
        let chunk = array.slice(index, index+chunk_size);

        tempArray.push(chunk);
    }

    return tempArray;
}

export function parseArgArray(argsArray) {

	var systemsToUpdate = [];
	var bodiesToUpdate = [];

	argsArray.forEach( arg => {

		if(arg.indexOf(ARG_SYSTEMS_STRING) !== -1 ) {

			let arrayString = arg.replace(ARG_SYSTEMS_STRING, '').trim();
				arrayString = arrayString.replace('[', '').replace(']','');

			let array = arrayString.split(',');

			systemsToUpdate = array.map( systemId => {
				return parseInt(systemId, 10);
			});

		} else if( arg.indexOf(ARG_BODIES_STRING) !== -1) {

			let arrayString = arg.replace(ARG_BODIES_STRING, '').trim();
				arrayString = arrayString.replace('[', '').replace(']','');

			let array = arrayString.split(',');

			bodiesToUpdate = array.map( bodyId => {
				return parseInt(bodyId, 10);
			});

		}

	});

	return {
		systems: systemsToUpdate,
		bodies: bodiesToUpdate
	}

}