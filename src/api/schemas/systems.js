import { API_CANONN_STEP } from '../../settings';

/*
	GraphQL query schema for Bodies to grab data from Canonn API

	query { } is omited on purpose
*/

export default function systemsSchema(limit = API_CANONN_STEP, start = 0, whereFilter="{}") {

	return `
	{
		systems(
			limit: ${limit}, 
			start: ${start},
			where: ${whereFilter}
		){

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