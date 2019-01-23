/*
	This file contains all the API functions to be used in scripts.
	You SHOULD ONLY use these functions to communicate with APIs in your scripts.
*/

import CAPI_GET from './canonn/capi_get';
import CAPI_UPDATE from './canonn/capi_update';
import EDSM_GET from './edsm/edsm_get';

import { EDSM_MAX_CALL_STACK } from '../settings';

import { getCAPIData, updateCAPIData } from './canonn/canonn';
import { postEDSM } from './edsm/edsm';

import { chunkArray } from '../utils';


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
	options: {
		autoAdd: true - if the script should automatically check if an object exists, and if not, send a POST request to add it.
		updater: custom updater for this update call. If not specified will use default from capi_update.js [type]
	}
*/
export async function CAPI_update(type, data, options={ autoAdd: true, updater: null }) {

	if( CAPI_UPDATE[type] ) {

		if( Array.isArray(data) ) {
			for(const dataPart in data) {
				console.log('<- Update "'+type+'": ['+ (parseInt(dataPart)+1) +'/'+data.length+']');
				await updateCAPIData(CAPI_UPDATE[type], data[dataPart], options)
			}

		} else {
			await updateCAPIData(CAPI_UPDATE[type], data, options);
		}		

	} else {
		console.log('- [ERROR] CAPI_update [type] argument "'+type+'" not found in capi_update.js file.');
		return false;
	}

}


/*
	Fetch data from EDSM
	type: can be found in edsm_get.js
	data: should be according to edsm_get[type]
*/
export async function EDSM_fetch(type, data) {

	if( EDSM_GET[type] ) {

		// If it's systems, we'll just chunk it up into EDSM_MAX_CALL_STACK sizes
		// and fetch each chunk separately.
		if(type === 'systems') {
			
			if( Array.isArray(data.systemName) && data.systemName.length > EDSM_MAX_CALL_STACK ) {
				// Array needs to be split

				let chunkedArray = chunkArray(data.systemName);
				let responseData = [];

				console.log('<- Fetching '+data.systemName.length+' [systems] in '+chunkedArray.length+' chunks from EDSM.');

				for(const stack in chunkedArray) {

					let fetchData = Object.assign({}, EDSM_GET[type].baseData, { systemName: chunkedArray[stack] });
					let r = await postEDSM( EDSM_GET[type].url, fetchData )

					responseData.push( ...r );
				}

				return responseData;

			} else {
				// Array is below or equal to EDSM_MAX_CALL_STACK size

				let fetchData = Object.assign({}, EDSM_GET[type].baseData, data);
				return await postEDSM( EDSM_GET[type].url, fetchData );

			}

		} else {
			// It's something else I tell you

			console.log('<- Fetching ['+type+'] from EDSM.');

			let responseData = [];

			if( Array.isArray(data.systemName) ) {

				for(const system in data.systemName) {

					let fetchData = Object.assign({}, EDSM_GET[type].baseData, { systemName: data.systemName[system] });
					let r = await postEDSM( EDSM_GET[type].url, fetchData )

					responseData.push( r );
				}

			} else {

				let fetchData = Object.assign({}, EDSM_GET[type].baseData, data);
				let r = await postEDSM( EDSM_GET[type].url, fetchData );

				responseData.push( r );

			}

			console.log('responseData', responseData);

			return responseData;
			

		}
		

	}

}