import { API_CANONN_STEP } from '../../settings';

/*
	GraphQL query schema for API Updates to grab data from Canonn API

	query { } is omited on purpose
*/

export default function apiupdatesSchema(limit = API_CANONN_STEP, start = 0, whereFilter="{}") {

	return `
	{
		apiupdates(
			limit: ${limit}, 
			start: ${start},
			where: ${whereFilter},
			sort: "UpdateTime:desc"
		) {
			id
			notes
			updateTime
			updateLog
		}
	}`;
}
