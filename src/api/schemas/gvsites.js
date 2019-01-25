import { API_CANONN_STEP } from '../../settings';

/*
    query { } is omited on purpose
*/

export default function gvsitesSchema(limit = API_CANONN_STEP, start = 0, whereFilter="{}") {

    return `
    {
        gvsites(
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