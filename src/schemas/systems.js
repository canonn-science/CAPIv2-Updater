import { API_CANONN_STEP } from '../settings.js';

/*
	GraphQL query schema for Bodies to grab data from Canonn API

	query { } is omited on purpose
*/

export default function systemsQL(limit = API_CANONN_STEP, start = 0) {

	return `
	{
		systems(limit: ${limit}, start:${start}) {
			id
			systemName
			edsmID
			id64
			edsmCoordX
			edsmCoordY
			edsmCoordZ
			edsmCoordLocked
		}
	}`;
}