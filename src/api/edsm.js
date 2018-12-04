const fetch = require("node-fetch");

const API_SYSTEM = 'https://www.edsm.net/api-system-v1/bodies';
const API_SYSTEMS = 'https://www.edsm.net/api-v1/systems';

import { updateBody, updateSystem } from './canonn.js';


export function queryEDSMSystems(systems) {

	return new Promise(function(resolve, reject) {

		console.log(' > [EDSM] Fetching systems...');
		console.log('');
		console.log(systems);
		console.log('');

		fetch(API_SYSTEMS, {
			method: 'POST',
			headers: { 
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				systemName: systems,
				showCoordinates: true
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

export function queryEDSMBodies(systemName) {

	return new Promise(function(resolve, reject) {

		console.log(' > [EDSM] Fetching...', systemName);

		fetch(API_SYSTEM+'?systemName='+systemName, {
			method: 'GET'
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