/*
	Validates if System is a suspect for update
*/

export default function validateSystem(system) {

	if(system.edsmCoordLocked) {
		return true;
	}

	return false;
	
}