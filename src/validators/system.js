/*
	Validates if System is a suspect for update
*/

export default function validateSystem(system) {

	// leave this as invalid == true by default
	// invalid == true 	-> candidate for update
	// invalid == false -> not a candidate
	let invalid = true;

	// implement logic to check if the object is a candidate
	if(system.edsmCoordLocked) {
		invalid = false;
	}

	// return object state
	return invalid;
	
}