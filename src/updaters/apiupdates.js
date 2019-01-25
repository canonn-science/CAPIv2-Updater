/*
	apiupdates updater
*/

// For this one fucking time due to Strapi.
const moment = require('moment');
import { LOCALE, TIMEZONE } from '../settings';

export default function apiupdatesUpdater(updateLog = {}) {

	if(updateLog) {

		let localDate = new Date().toLocaleString(LOCALE, { timeZone: TIMEZONE });
		let date = moment( localDate, "MM/DD/YYYY HH:mm:ss a" ).format('YYYY-MM-DD HH:mm:ss');

		const output = {
			updateTime: date,
			updateLog: updateLog
		};

		return output;

	} else {
		console.log('[ERROR] [UPDATER] apiupdatesUpdater: apiupdate not defined or wrong: ', apiupdate);
		return null;
	}

}

