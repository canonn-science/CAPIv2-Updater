/*
	This file contains all the API functions to be used in scripts.
	You SHOULD ONLY use these functions to communicate with APIs in your scripts.
*/

import { UPDATE } from '../index.js';
import CAPI_GET from './capi_get.js';

import { getCAPIData } from './canonn.js';


/*
	Fetch data from Canonn API
	type: can be found in capi_get.js
	data: an object to control graphQL query where modifier
*/
export async function CAPI_fetch(type, data) {

	if( CAPI_GET[type] ) {

		// TODO in a future version:
		// Sync local type data with Canonn API so there's no need
		// for each script to dowload data again

		// if( UPDATE.type.isDownloaded ) -> skip download
		// requires syncing updaters data with API

		let response = await getCAPIData(CAPI_GET[type], data);

		return response;

	} else {
		console.log('- [ERROR] CAPI_fetch [type] argument "'+type+'" not found in capi_get.js file.');
		return false;
	}

}

/*
	Update data in Canonn API
	type: can be found in capi_update.js
	data: should be according to capi_update[type]
*/
export async function CAPI_update(type, data) {

	if( CAPI_GET[type] ) {


	} else {
		console.log('- [ERROR] CAPI_fetch [type] argument "'+type+'" not found in capi_update.js file.');
		return false;
	}

}

export async function EDSM_fetch(type, data) {

}