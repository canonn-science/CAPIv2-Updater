import { API_CANONN_STEP } from '../../settings';

/*
    GraphQL query schema for Bodies to grab data from Canonn API

    query { } is omited on purpose
*/

export default function excludeclientsSchema(limit = API_CANONN_STEP, start = 0, whereFilter="{}") {

    return `
    {
        excludeclients(
            limit: ${limit}, 
            start: ${start},
            where: ${whereFilter}
        ){
            id
            version
            reason
        }
    }`;
}