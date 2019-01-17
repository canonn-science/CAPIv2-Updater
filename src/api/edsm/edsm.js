const fetch = require("node-fetch");

import { EDSM_DELAY } from '../../settings';
/*
	This file contains all the EDSM API functions used to communicate with EDSM.
	You SHOULD NOT use these functions in your scripts.
*/


export function postEDSM(url, data) {
	return new Promise(function(resolve,reject) {

		fetch(url, {
				method: 'POST',
				headers: { 
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
	
			}).then(r => {
	
				try {
	
					return r.json();
	
				} catch(e) {
	
					console.log('<- [EDSM] ERROR: ');
					console.log('');
					console.log(e);
					console.log('');
					console.log('<- [EDSM] on request:');
					console.log('');
					console.log(r)
					console.log('')
	
				}
	
			}).then(r => {
				console.log('<- [EDSM] Ok... ...Waiting '+EDSM_DELAY+'ms for next fetch.')

				let t = setTimeout( () => {
					resolve(r);
				}, EDSM_DELAY);

			});

	});
}