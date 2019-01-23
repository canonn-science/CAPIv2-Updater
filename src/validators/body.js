/*
	Validates if Body is a suspect for update

	TODO: This needs serious consideration based on:
	- planet/star
	- planet type (HMC planets, gas giants etc)
	- atmosphere?
	- stuff
*/

export default function validateBody(body) {

	let valid = [];

	if( !body.id || !body.bodyName ) {
		console.log('[ERROR]: Missing ID or bodyName for: ', body);
		return false;
	}

	// basics check
	if( 
		body.id64 == null 					||
		body.edsmID == null 				||
		body.bodyID == null 				||
		body.type == null 					||
		body.subType == null 				||
		body.distanceToArrival == null		||
		body.surfaceTemperature == null
	) {
		valid.push(false);
	}

	// checks based on body types
	if(!body.type) {
		valid.push(false);
	}

	if( body.type && body.type.toLowerCase() == 'planet' ) {

		if(
			body.earthMasses == null 		||
			body.radius == null 			||
			body.solidComposition == null
		) {
			valid.push(false);
		}
		
	} else if( body.type && body.type.toLowerCase() == 'star' ) {

		if(
			body.luminosity == null 		||
			body.age == null 				||
			body.absoluteMagnitude == null	||
    		body.solarMasses == null		||
    		body.solarRadius == null
		) {
			valid.push(false);
		}

	} else {
		valid.push(false);
	}

	if(valid.indexOf(false) != -1) {
		return false;

	} else {
		return true;
	}
}