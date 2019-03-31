/*
	Systems updater
	Input: System (EDSM)
	Output: System (CAPI)
*/

import { mapFields } from '../utils';

export default function system_from_edsm({capisystem = {}, edsmsystem = null}) {

	if(edsmsystem) {

		// See mapFields function in utils.js
		// mapFields(source, update, map)
		// This will copy all edsmsystem fields into output,
		// (TODO) checking for differences along the way

		const output = mapFields(capisystem, {

		//	capisystem fields	: 	edsmsystem fields
			"systemName"		: 	edsmsystem.name.toUpperCase(), 
			"edsmID"			: 	edsmsystem.id,
			"id64"				: 	edsmsystem.id64,
			"edsmCoordLocked" 	: 	edsmsystem.coordsLocked,
			"edsmCoordX"		: 	edsmsystem.coords.x,
			"edsmCoordY"		: 	edsmsystem.coords.y,
			"edsmCoordZ"		: 	edsmsystem.coords.z

		});

		// If there is an existing CAPI system, add an ID so the updater knows it should PUT not POST
		if(capisystem && capisystem.id) {
			output.id = capisystem.id;
		}

		return output;

	} else {
		console.log('[ERROR] [UPDATER] system_from_edsm: edsmsystem not defined or wrong: ', edsmsystem);
		return null;
	}

}