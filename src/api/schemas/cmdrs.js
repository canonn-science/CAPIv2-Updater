import { API_CANONN_STEP } from '../../settings';

/*
    GraphQL query schema for Bodies to grab data from Canonn API

    query { } is omited on purpose
*/

export default function cmdrsSchema(limit = API_CANONN_STEP, start = 0, whereFilter="{}") {

    return `
    {
        cmdrs(
            limit: ${limit}, 
            start: ${start},
            where: ${whereFilter}
        ){
            id
            cmdrName            
        }
    }`;
}