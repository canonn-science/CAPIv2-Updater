import { API_CANONN_STEP } from '../../settings';

/*
    GraphQL query schema for Bodies to grab data from Canonn API

    query { } is omited on purpose
*/

export default function btreportsSchema(limit = API_CANONN_STEP, start = 0, whereFilter="{}") {

    return `
    {
        btreports(
            limit: ${limit}, 
            start: ${start},
            where: ${whereFilter}
        ){

            id
            cmdrName
            clientVersion
            userType
            reportType
            reportStatus
            systemName
            bodyName
            latitude
            longitude
            type
            
        }
    }`;
}