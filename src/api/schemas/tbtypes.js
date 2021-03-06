import { API_CANONN_STEP } from '../../settings';

/*
    query { } is omited on purpose
*/

export default function tbtypesSchema(limit = API_CANONN_STEP, start = 0, whereFilter="{}") {

    return `
    {
        tbtypes(
            limit: ${limit}, 
            start: ${start},
            where: ${whereFilter}
        ){
            id
            type
            journalName
            journalID           
        }
    }`;
}