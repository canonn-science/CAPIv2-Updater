/*

This is the manager for update logs.
It tracks changes made in each update and then reports it back to CAPI apiupdates table.

*/

import { LOCALE, TIMEZONE } from './settings';
import ScriptManager from './ScriptManager';

import { CAPI_update } from './api/api';

import { 
	UI_header
} from './ui.js';


const LOG_TYPES = {
	'update': '-> [UPDATE]: ',
	'error': '-> [ERROR]: ',
	'networkerror': '-> [NETWORK ERROR]: ',
}


const Update = {

	errorLog: [],
	updateLog: [],

	log: log,

	submit: function() {

		let log = {
			errorLog: this.errorLog,
			updateLog: this.updateLog
		}

		UI_header('Submitting UpdateLog to CAPI');
		CAPI_update('apiupdates', log);

	}

}
export default Update;

/*

	Usage: UpdateLog.logError(...)
	Use this to log network and other errors through the app

*/

function log({type="error", msg ='', object={}, submit=false}) {

	if( type == "error" || type == "networkerror" ) {

		logError({type: type, msg: msg, object: object, submit: false});

	} else if( type == "update" ) {

		logUpdate({type: type, msg: msg, object: object, submit: false});

	} else {
		console.log();
		console.log('[WARNING]: You are trying to log a type that isn\'t available. See UpdateManager.js LOG_TYPES for more info.');
		console.log();
	}

}

function logError({type="error", msg ='', object={}, submit=false}) {

	const DT = new Date().toLocaleString(LOCALE, { timeZone: TIMEZONE });
	const script = Object.assign({}, ScriptManager.activeScript);

	let errorMsg = LOG_TYPES[type]+msg;

	console.log();
	console.log(errorMsg);

	const newError = {
		datetime: DT,
		message: errorMsg,
		script: JSON.stringify(script),
		object: JSON.stringify(object)
	}

	Update.errorLog.push(newError);

	if(submit) {
		Update.submit();
	}


}

function logUpdate({type="update", msg ='', object={}, submit=false}) {

	const DT = new Date().toLocaleString(LOCALE, { timeZone: TIMEZONE });
	const script = Object.assign({}, ScriptManager.activeScript);

}