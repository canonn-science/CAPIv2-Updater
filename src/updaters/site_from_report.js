/*
	Sites updater
*/

import { mapFields } from '../utils';

export default function site_from_report({site = {}, report = null}) {

	if(report) {

		// See mapFields function in utils.js
		// mapFields(source, update, map)
		// This will copy all edsmsystem fields into output,
		// (TODO) checking for differences along the way

		const output = mapFields(site, {

		//	btsite fields		: 	btreport fields
			"latitude"			: 	report.latitude, 
			"longitude"			: 	report.longitude

		});

		

		// If there is an existing CAPI system, add an ID so the updater knows it should PUT not POST
		if(site && site.id) {
			output.id = site.id;
		}

		return output;

	} else {
		console.log('[ERROR] [UPDATER] btsite_from_btreport: btreport not defined or wrong: ', report);
		return null;
	}

}