/*
	Validates if System is a suspect for update
*/

export default function invalidSystem(system) {

	if(system.edsmCoordLocked) {
		return false;
	}

	return true;
	
}