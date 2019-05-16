/*
	Validates if Body is a suspect for update

	TODO: This needs serious consideration based on:
	- planet/star
	- planet type (HMC planets, gas giants etc)
	- atmosphere?
	- stuff
*/

export default function invalidBody(body) {

	if( !body.id || !body.bodyName ) {
		console.log('[ERROR]: Missing ID or bodyName for: ', body);
		return true;
	}

	// basics check
	if( 
		//body.id64 == null 					||
		body.edsmID == null 				||
		body.bodyID == null 				||
		body.type == null 					||
		body.subType == null 				||
		body.distanceToArrival == null		||
		body.surfaceTemperature == null
	) {
		return true;
	}

	// checks based on body types
	if(!body.type) {
		return true;
	}

	if( body.type && body.type.toLowerCase() == 'planet' ) {

		if(
			body.earthMasses == null 		||
			body.radius == null 			||
			body.solidComposition == null
		) {
			return true;
		}
		
	} else if( body.type && body.type.toLowerCase() == 'star' ) {

		if(
			body.luminosity == null 		||
			body.age == null 				||
			body.absoluteMagnitude == null	||
    		body.solarMasses == null		||
    		body.solarRadius == null
		) {
			return true;
		}

	} else {
		return true;
	}

	return false;

}