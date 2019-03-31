/*
	CMDRs updater
*/

export default function cmdrUpdater(cmdr) {

	if(cmdr) {

		// See mapFields function in utils.js
		// mapFields(source, update, map)
		// This will copy all edsmsystem fields into output,
		// (TODO) checking for differences along the wat

		return cmdr;

	} else {
		console.log('[ERROR] [UPDATER] cmdrUpdater: cmdr not defined or wrong: ', cmdr);
		return null;
	}

}