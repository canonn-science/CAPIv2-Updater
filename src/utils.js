
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

/*
	This is a promisified setTimeout
*/

export function sleep(fn, delay) {

	return new Promise( function(resolve, reject) {

		setTimeout(() => {
			resolve( fn() );
		}, delay);

	}).catch( e => {
		console.log('[ERROR] Sleep error: ', e);
	});

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

/*
	Comparing string similarity and returning percentage of match.
	Stolen sneakily from:
	https://stackoverflow.com/questions/10473745/compare-strings-javascript-return-of-likely
	https://en.wikipedia.org/wiki/Levenshtein_distance
*/
export function stringsSimilarity(s1, s2) {

	let longer = s1;
	let shorter = s2;

	if (s1.length < s2.length) {
		longer = s2;
		shorter = s1;
	}

	let longerLength = longer.length;
	if (longerLength == 0) {
		return 1.0;
	}

	return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

function editDistance(s1, s2) {
	
	s1 = s1.toLowerCase();
	s2 = s2.toLowerCase();

	const costs = new Array();
	for (let i = 0; i <= s1.length; i++) {
		
		let lastValue = i;

		for (let j = 0; j <= s2.length; j++) {
			if (i == 0) {
				costs[j] = j;

			} else {

				if (j > 0) {
					var newValue = costs[j - 1];

					if (s1.charAt(i - 1) != s2.charAt(j - 1)) {
						newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
					}

					costs[j - 1] = lastValue;
					lastValue = newValue;
				}
			}
		}

		if (i > 0) {
			costs[s2.length] = lastValue;
		}

	}

	return costs[s2.length];
}

/*
	mapFields(source, valueMap)

	This function is used to copy (override) and track fields that changed between source and update objects.

	source: source object (usually from CAPI)
	
	map: a map of fields in source and values to copy
		Field names from source and update may differ, for example:
		CAPI system name is in system.systemName
		EDSM system name is in system.name

		You can map these two so the function knows which fields to compare.
		For example:

		map: {
		//	source			: 	update 
			"systemName"	: 	edsmsystem.name  
		}

		Will copy map value to source fieldname.
*/

export function mapFields(source, map) {

	let output = { ...source };
	let mapKeys = Object.keys(map);

	mapKeys.forEach( key => {

		if( !isSame(source[key], map[key]) ) {
			
			if( typeof map[key] != 'undefined' ) {
				// TODO: report to updateLog
				console.log('	Field "'+key+'" is different. Source: "'+source[key]+'" | Value: "'+map[key]+'"');
				output[key] = map[key];
			}

		} else {

			if(source[key]) {
				output[key] = source[key];
			}
		}

	});

	return output;

}

/*
	Used to soft check if value v1 is same as value v2
*/
export function isSame(v1, v2) {

	if( typeof v1 == 'object' ) {

		//Oh boy... Shady territory.

		try {
			return JSON.stringify(v1) == JSON.stringify(v2);
		} catch(e) {
			console.log('[ERROR] in isDifferent(v1, v2), could not JSON.stringify objects');
		}

	} else {
		return v1 == v2;
	}


}