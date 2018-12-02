import { API_CANONN_STEP } from '../settings.js';

/*
	GraphQL query schema for Bodies to grab data from Canonn API

	query { } is omited on purpose
*/

export default function bodiesQL(limit = API_CANONN_STEP, start = 0) {

	return `
	{
		bodies(limit: ${limit}, start:${start}) {
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
