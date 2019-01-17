
import { 
	EDSM_DELAY,
	EDSM_MAX_CALL_STACK,
	ARG_SYSTEMS_STRING,
	ARG_BODIES_STRING
} from './settings';


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

// parse runtime arguments logic
// if new runtime parameters are added you should revisit this function

// TODO:
// - 
export function parseArgArray(update) {

	let systemsToUpdate = [];
	let bodiesToUpdate = [];

	update.runArgs.forEach( arg => {

		if(arg.indexOf(ARG_SYSTEMS_STRING) !== -1 ) {

			let arrayString = arg.replace(ARG_SYSTEMS_STRING, '').trim();
				arrayString = arrayString.replace('[', '').replace(']','');

			let arrayIds = arrayString.split(',');

			systemsToUpdate = arrayIds.filter( systemId => {
				
				let id = parseInt(systemId, 10);
				let system = findInArray(update.systems.all, 'id', id);

				if( system ) {
					return system;
				}

			});

		}

		if( arg.indexOf(ARG_BODIES_STRING) !== -1) {

			let arrayString = arg.replace(ARG_BODIES_STRING, '').trim();
				arrayString = arrayString.replace('[', '').replace(']','');

			let arrayIds = arrayString.split(',');

			bodiesToUpdate = arrayIds.filter( bodyId => {
				
				let id = parseInt(bodyId, 10);
				let body = findInArray(update.bodies.all, 'id', id);

				if( body ) {
					return body;
				}

			});

		}

	});

	update.systems.updateCandidates = systemsToUpdate;
	update.bodies.updateCandidates = bodiesToUpdate;

}

// find an element with specific field and value in an array of objects
// ex: findInArray(systems, 'id', 6) will return a system with id = 6 (or null if not found)
export function findInArray(objectsArray, fieldname, value) {

	return objectsArray.find(element => {
		if( element[fieldname] == value ) {
			return element;
		}
	});

}

/*
	Prints a dot to console every 1 second.
	Usage:
	printProgress.start();
		... some async call
	printProgress.stop();
*/
export const printProgress = {

	interval: null,

	start: function() {
		console.log('');
		process.stdout.write('.');
		this.interval = setInterval(function() {
			process.stdout.write('.');
		}, 1000);

	},

	stop: function() {
		clearInterval(this.interval);
		this.interval = null;
		console.log('');
	}

	
}