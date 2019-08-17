import { mapFields } from '../utils';

export default function system_from_edsm({capibody = {}, edsmbody = null}) {

	if(edsmbody) {

		// See mapFields function in utils.js
		// mapFields(source, map)
		// This will copy all edsmsystem fields into output,
		// (TODO) checking for differences along the way

		const output = mapFields(capibody, {

		//	capisystem fields	: 	edsmsystem fields

			"bodyName"												: 		edsmbody.name.toUpperCase(),
			"edsmID"													: 		edsmbody.id,
			"bodyID"													: 		edsmbody.bodyId,
			"id64"														: 		edsmbody.id64,
			"type"														: 		edsmbody.type,
			"subType"													: 		edsmbody.subType,
			"offset"													: 		edsmbody.offset,
			"distanceToArrival"								: 		edsmbody.distanceToArrival,
			"isMainStar"											: 		edsmbody.isMainStar,
			"isScoopable"											: 		edsmbody.isScoopable,
			"isLandable"											: 		edsmbody.isLandable,
			"age"															: 		edsmbody.age,
			"luminosity"											: 		edsmbody.luminosity,
			"absoluteMagnitude"								: 		edsmbody.absoluteMagnitude,
			"solarMasses"											: 		edsmbody.solarMasses,
			"solarRadius"											: 		edsmbody.solarRadius,
			"gravity"													: 		edsmbody.gravity,
			"earthMasses"											: 		edsmbody.earthMasses,
			"radius"													: 		edsmbody.radius,
			"surfaceTemperature"							: 		edsmbody.surfaceTemperature,
			"surfacePressure"									: 		edsmbody.surfacePressure,
			"volcanismType"										: 		edsmbody.volcanismType,
			"atmosphereType"									: 		edsmbody.atmosphereType,
			"terraformingState"								: 		edsmbody.terraformingState,
			"orbitalPeriod"										: 		edsmbody.orbitalPeriod,
			"semiMajorAxis"										: 		edsmbody.semiMajorAxis,
			"orbitalEccentricity"							: 		edsmbody.orbitalEccentricity,
			"orbitalInclination"							: 		edsmbody.orbitalInclination,
			"argOfPeriapsis"									: 		edsmbody.argOfPeriapsis,
			"rotationalPeriod"								: 		edsmbody.rotationalPeriod,
			"rotationalPeriodTidallyLocked"		: 		edsmbody.rotationalPeriodTidallyLocked,
			"axialTilt"												: 		edsmbody.axialTilt,
			"solidComposition"								: 		edsmbody.solidComposition,
			"atmosphere"											: 		edsmbody.atmosphere,
			"material"												: 		edsmbody.materials

		});

		// If there is an existing CAPI system, add an ID so the updater knows it should PUT not POST
		if(capibody && capibody.id) {
			output.id = capibody.id;
		}

		if(capibody && capibody.system) {
			output.system = capibody.system;
		}

		return output;

	} else {
		console.log('[ERROR] [UPDATER] body_from_edsm: body does not exist in edsm: ', edsmbody);
		return null;
	}

}