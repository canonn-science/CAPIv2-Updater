/*
	This file contains all the Canonn API functions used to communicate with CAPI.
	You SHOULD NOT use these functions in your scripts.
*/

const fetch = require("node-fetch");

const API_BODIES = 'https://www.edsm.net/api-system-v1/bodies';
const API_SYSTEMS = 'https://www.edsm.net/api-v1/systems';

import { updateBody, updateSystem } from './canonn.js';

/*
	Query EDSM for systems
	https://www.edsm.net/api-v1/systems
*/
export function queryEDSMSystems(systems) {

	return new Promise(function(resolve, reject) {

		console.log(' > [EDSM] Fetching '+systems.length+' systems...');

		fetch(API_SYSTEMS, {
			method: 'POST',
			headers: { 
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				systemName: systems,
				showCoordinates: true,
				showId: true
			})
		}).then(r => {

			try {

				return r.json();

			} catch(e) {

				console.log(' < [EDSM] ERROR: ');
				console.log('');
				console.log(e);
				console.log('');
				console.log(' < [EDSM] on request:');
				console.log('');
				console.log(r)

			}

		}).then( r=> {
			console.log(' < [EDSM] Ok...')
			resolve(r);
		});

	});

}

/*
	Query EDSM for system bodies
	https://www.edsm.net/api-system-v1/bodies
*/
export function queryEDSMBodies(systemName) {

	return new Promise(function(resolve, reject) {

		console.log(' > [EDSM] Fetching bodies in system:', systemName);

		fetch(API_BODIES, {
			method: 'POST',
			headers: { 
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				systemName: systemName
			})

		}).then(r => {

			try {

				return r.json();

			} catch(e) {

				console.log(' < [EDSM] ERROR: ');
				console.log('');
				console.log(e);
				console.log('');
				console.log(' < [EDSM] on request:');
				console.log('');
				console.log(r)

			}

		}).then( r=> {
			console.log(' < [EDSM] Ok...')
			resolve(r.bodies);
		});

	});

}

export default function queueUpdates(type, updateArray, fn) {

	let index = 0;
	const keyArray = {};
	const names = [];
	const updateErrors = [];

	if(type == 'systems') {

		console.log('============================================');
		console.log('UPDATING SYSTEMS');
		console.log('============================================');
		console.log('');

		// systems are passed in as blocks (arrays) of 
		// EDSM_MAX_CALL_STACK systems at one call.

		let chunks = chunkArray(updateArray);

		chunks.forEach( (systemsBlock, i) => {

			keyArray['CHUNK ['+i+']'] = systemsBlock;
			
			if( names.indexOf(i) == -1) {
				names.push('CHUNK ['+i+']');
			}
		});

	} else if( type == 'bodies' ) {

		console.log('============================================');
		console.log('UPDATING BODIES');
		console.log('============================================');
		console.log('');

		updateArray.forEach( body => {

			// we are looping over system names
			let name = body.system.systemName;

			// Then to each system name we're adding bodies that
			// are inside that system
			if( keyArray[name] ) {
				keyArray[name].push( body );
			} else {
				keyArray[name] = [body];
			}

			if( names.indexOf(name) == -1) {
				names.push(name);
			}
		});

	} else {
		console.log('[ERROR]: type argument should be either "systems" or "bodies"!');
		return null;
	}

	return new Promise(function(resolve, reject) {
		function next() {

			if(index < names.length) {

				let item = names[index++];
				let nextQ = keyArray[ item ];
	
				console.log('['+index+'/'+names.length+'] ~~ Updating '+item+': '+nextQ.length+' '+type);
	
				fn(item, nextQ, updateErrors).then( (r) => {

					console.log('');
					console.log('> Waiting '+EDSM_DELAY+'ms...');
	
					let AnthorsDelay = setTimeout(function() {
						console.log('');
						next();
					}, EDSM_DELAY);
	
				});
	
			} else {
				console.log('');
				console.log('[Ok...] UPDATE COMPLETE');
				console.log('');

				if(updateErrors.length > 0) {
					console.log('!!!!!!!!!!!!!!!! ERRORS !!!!!!!!!!!!!!!!!!!!');
					console.log('');
					updateErrors.forEach( error => {
						console.log(' - System: ', error.system);
						console.log(' - Body: ', error.body);
						console.log(' - Reason: ', error.msg);
						console.log('');
					});
					console.log('');
					console.log('!!!!!!!!!!!!!!!! ERRORS !!!!!!!!!!!!!!!!!!!!');
					console.log('');
				}

				resolve();
			}
			
		}
		next();
	});

}