import { API_CANONN_STEP } from '../../settings';

/*
	GraphQL query schema for Bodies to grab data from Canonn API

	query { } is omited on purpose
*/

export default function bodiesSchema(limit = API_CANONN_STEP, start = 0, whereFilter="{}") {

	return `
	{
		bodies(
			limit: ${limit},
			start:${start},
			where: ${whereFilter}
		){

			id
			bodyName
			system {
				id
				systemName
			}
	
			edsmID
			bodyID
			id64
			type
			subType
			offset
			distanceToArrival
			isMainStar
			isScoopable
			isLandable
			age
			luminosity
			absoluteMagnitude
			solarMasses
			solarRadius
			gravity
			earthMasses
			radius
			surfaceTemperature
			surfacePressure
			volcanismType
			atmosphereType
			terraformingState
			orbitalPeriod
			semiMajorAxis
			orbitalEccentricity
			orbitalInclination
			argOfPeriapsis
			rotationalPeriod
			rotationalPeriodTidallyLocked
			axialTilt
			solidComposition
			atmosphere
			material
			
		}
	}`;
}
