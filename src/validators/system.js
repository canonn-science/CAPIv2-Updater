/*
	Validates if System is a suspect for update
*/

export default function invalidSystem(system) {

	if(system.edsmCoordLocked || system.edsmID) {
		return false;
	}

	return true;
	
}