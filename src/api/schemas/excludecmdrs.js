import { API_CANONN_STEP } from '../../settings';

/*
    query { } is omited on purpose
*/

export default function excludecmdrsSchema(limit = API_CANONN_STEP, start = 0, whereFilter="{}") {

    return `
    {
        excludecmdrs(
            limit: ${limit}, 
            start: ${start},
            where: ${whereFilter}
        ){
            id
            cmdrName
            reason
        }
    }`;
}