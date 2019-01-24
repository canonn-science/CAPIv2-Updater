/*
	BT Sites updater
*/

import { mapFields } from '../utils';

export default function btsite_from_btreport({btsite = {}, btreport = null}) {

	if(btreport) {

		// See mapFields function in utils.js
		// mapFields(source, update, map)
		// This will copy all edsmsystem fields into output,
		// (TODO) checking for differences along the way

		const output = mapFields(btsite, {

		//	btsite fields		: 	btreport fields
			"latitude"			: 	btreport.latitude, 
			"longitude"			: 	btreport.longitude

		});

		

		// If there is an existing CAPI system, add an ID so the updater knows it should PUT not POST
		if(btsite && btsite.id) {
			output.id = btsite.id;
		}

		return output;

	} else {
		console.log('[ERROR] [UPDATER] btsite_from_btreport: btreport not defined or wrong: ', btreport);
		return null;
	}

}