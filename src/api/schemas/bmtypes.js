import { API_CANONN_STEP } from '../../settings';

/*
    query { } is omited on purpose
*/

export default function bmtypesSchema(limit = API_CANONN_STEP, start = 0, whereFilter="{}") {

    return `
    {
        bmtypes(
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