/*
	Sites updater
*/

export default function siteUpdater(report) {

	if(report) {

		// See mapFields function in utils.js
		// mapFields(source, update, map)
		// This will copy all edsmsystem fields into output,
		// (TODO) checking for differences along the way

		const output = report;

		return output;

	} else {
		console.log('[ERROR] [UPDATER] system_from_edsm: edsmsystem not defined or wrong: ', edsmsystem);
		return null;
	}

}