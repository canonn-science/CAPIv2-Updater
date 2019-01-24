import { API_CANONN_STEP } from '../../settings';

/*
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
