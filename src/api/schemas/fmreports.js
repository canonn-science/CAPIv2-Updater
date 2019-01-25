import { API_CANONN_STEP } from '../../settings';

/*
    query { } is omited on purpose
*/

export default function fmreportsSchema(limit = API_CANONN_STEP, start = 0, whereFilter="{}") {

    return `
    {
        fmreports(
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