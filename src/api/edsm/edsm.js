import { EDSM_DELAY } from '../../settings';
import { API_fetch } from '../api';

/*
	This file contains all the EDSM API functions used to communicate with EDSM.
	You SHOULD NOT use these functions in your scripts.
*/


export function postEDSM(url, data) {
	return new Promise(async function(resolve,reject) {

		let response = await API_fetch({
		
			url: url,
			method: 'POST',
			headers: { 
				'Content-Type': 'application/json'
			},
			payload: data,
			delay: EDSM_DELAY

		});

		resolve(response);

	});
}