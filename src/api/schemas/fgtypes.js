import { API_CANONN_STEP } from '../../settings';

/*
    query { } is omited on purpose
*/

export default function fgtypesSchema(limit = API_CANONN_STEP, start = 0, whereFilter="{}") {

    return `
    {
        fgtypes(
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