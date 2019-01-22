import { API_CANONN_STEP } from '../../settings';

/*
    GraphQL query schema for Bodies to grab data from Canonn API

    query { } is omited on purpose
*/

export default function btsitesSchema(limit = API_CANONN_STEP, start = 0, whereFilter="{}") {

    return `
    {
        btsites(
            limit: ${limit}, 
            start: ${start},
            where: ${whereFilter}
        ){
            id
            siteID
            extoolID 
            system {
                id
                systemName
            }
            body {
                id
                bodyName
            }
            type {
                id
                type
                journalName
                journalID
            }
            discoveredBy {
                id
                cmdrName
            }
            latitude
            longitude
            verified
            visible
            
        }
    }`;
}