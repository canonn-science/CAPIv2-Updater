/*
	Validates if System is a suspect for update
*/

export default function validateSystem(system) {

	let valid = false;

	if(system.edsmCoordLocked) {
		valid = true;
	}

	return valid;
	
}