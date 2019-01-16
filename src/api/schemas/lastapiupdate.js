import { API_CANONN_STEP } from '../../settings.js';

/*
	GraphQL query schema for API Updates to grab data from Canonn API

	query { } is omited on purpose
*/

export default function lastApiUpdateSchema() {

	return `
	{
		apiupdates(limit: 1, sort: "UpdateTime:desc") {
			id
			forced
			updateTime
			updateLog
			bodiesUpdated
			systemsUpdated
		}
	}`;
}
