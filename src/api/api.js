/*
	This file contains all the API functions to be used in scripts.
	You SHOULD ONLY use these functions to communicate with APIs in your scripts.
*/

const fetch = require("node-fetch");

import Update from '../UpdateManager';

import CAPI_GET from './canonn/capi_get';
import CAPI_UPDATE from './canonn/capi_update';
import EDSM_GET from './edsm/edsm_get';

import { API_CANONN_DELAY, EDSM_MAX_CALL_STACK, ERR429_DELAY } from '../settings';

import { getCAPIData, updateCAPIData } from './canonn/canonn';
import { postEDSM } from './edsm/edsm';

import { sleep, chunkArray, printProgress } from '../utils';


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
		Update.log({
			type: 'error', 
			msg: 'CAPI_fetch [type] argument "'+type+'" not found in capi_get.js file.'
		});
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
	
		let response = [];
	
		if( Array.isArray(data) ) {
			for(const dataPart in data) {
				console.log('<- Update "'+type+'": ['+ (parseInt(dataPart)+1) +'/'+data.length+']');
				let r = await updateCAPIData(CAPI_UPDATE[type], data[dataPart], options);
	
				response.push(r);
			}
	
		} else {
			let r = await updateCAPIData(CAPI_UPDATE[type], data, options);
			response.push(r);
		}
	
		return response;		
	
	} else {
		Update.log({
			type: 'error', 
			msg: 'CAPI_update [type] argument "'+type+'" not found in capi_update.js file.'
		});
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

					console.log('<- Fetching ['+type+']');

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

					console.log('<- Fetching ['+type+']');

					let fetchData = Object.assign({}, EDSM_GET[type].baseData, { systemName: data.systemName[system] });
					let r = await postEDSM( EDSM_GET[type].url, fetchData )

					responseData.push( r );
				}

			} else {

				let fetchData = Object.assign({}, EDSM_GET[type].baseData, data);
				let r = await postEDSM( EDSM_GET[type].url, fetchData );

				responseData.push( r );

			}

			return responseData;
			

		}
		

	}

}


/*
	Fetch data from anywhere.
	Just make sure you pass parameters accordingly.
*/

export async function API_fetch({ url, method, headers, payload={}, delay=API_CANONN_DELAY }) {

	if(
		url &&
		method &&
		headers &&
		payload
	) {

		let response = null;

		try {

			response = await fetch(url, {
				method: method,
				headers: headers,
				body: JSON.stringify(payload)
			
			});

		} catch(e) {

			Update.log({
				type: 'networkerror',
				msg: 'Fetch error occured',
				object: e,
				submit: true
			});

			process.exit();

		}

		if(response.ok) {

			let jsonresponse = await response.json();
			return await sleep( () => jsonresponse, delay );


		} else {


			if( response.status == 429 ) {
				console.log('-> [NETWORK ERROR] 429 Too Many Requests.');
				console.log('   On accessing: "'+url+'"');
				console.log('   Waiting '+(ERR429_DELAY/1000)/60+' [minutes] and trying again.');

				printProgress.start();

				return await sleep(async () =>{

					printProgress.stop();

					console.log('[RETRY] Trying again...');
					console.log();

					return await API_fetch({
						url: url,
						method: method,
						headers: headers,
						payload: payload,
						delay: delay
					});

				}, ERR429_DELAY);


			} else {
				console.log('-> Network Error: '+response.status);
				return null;
			}


		}

	} else {
		console.log('[ERROR]');
	}


}