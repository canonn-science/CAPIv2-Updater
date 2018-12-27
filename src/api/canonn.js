const fetch = require("node-fetch");

import systemsSchema from '../schemas/systems.js';
import bodiesSchema from '../schemas/bodies.js';

import validateSystem from '../validators/system.js';
import validateBody from '../validators/body.js';

import { 
	API_CANONN_STEP,
	API_CANONN_GRAPHQL,
	API_CANONN_REST
} from '../settings.js';

const API_AUTH = API_CANONN_REST+'/auth/local';
const API_UPDATE_SYSTEM = API_CANONN_REST+'/systems/';
const API_UPDATE_BODY = API_CANONN_REST+'/bodies/';

const pullData = {};
var TOKEN = null;

// Log in to API, check .env for login details
export function authenticate(username, password) {

	console.log('Authenticating with Canonn API...');

	const options = {
		method: 'POST',
		headers: { 
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			identifier: username,
			password: password
		})
	};

	return fetch(API_AUTH, options).then(r => {
		if(r.status == 200) {
	
			try {
				return r.json().then( r => {
					TOKEN = r.jwt;

					console.log('> ...OK');
					console.log('> Hello '+r.user.username);
					console.log('............................................');
					return TOKEN;
				});

			} catch(e) {
				console.log('[ERROR] ', e);
				console.log('...........................................');
			}
	
		} else if(r.status == 400) {
			console.log('[FORBIDDEN] Authentication failed. Check your username/password in .env');
			console.log('[FORBIDDEN] or contact someone somewhere.');
			console.log('............................................');

			return false;
		} else {
			console.log('[ERROR] Status code: ', r.status);
			console.log('...........................................');

			return false;
		}

	});
}

// fetch data from CAPI graphQL
function fetchQLData(resolve, reject, counter = 0, query, qlNode) {

	const step = API_CANONN_STEP;

	fetch(API_CANONN_GRAPHQL, {
		
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			query: query(step, counter)
		})

	}).then( r => r.json() ).then( r => { 
	
		pullData[qlNode].push( ...r.data[qlNode] );

		if(r.data[qlNode].length == step) {
			fetchQLData(resolve, reject, counter+step, query, qlNode);
		} else {
			resolve(pullData[qlNode]);
		}
	})

}


// Pull bodies and systems data
// TODO: refactor this so it accepts any combination of data from the api (bodies, reports, sites, etc)

const systems = [];
const systemsUpdate = [];

const bodies = [];
const bodiesUpdate = [];

export function pullAPIData() {

	console.log('Fetching Systems and Bodies from Canonn API...');

	return Promise.all([ getSystems(), getBodies()] )
	.then( result => {
		systems.push(...result[0]);
		bodies.push(...result[1]);
		console.log('> ...OK');

		console.log('Validating Systems and Bodies');

		systems.forEach( system => {
			if( !validateSystem(system) ) {
				systemsUpdate.push(system);
			}
		});

		bodies.forEach( body => {
			if( !validateBody(body) ) {
				bodiesUpdate.push(body);
			}
		});
		console.log('> ...OK');

		return {
			systems: systems,
			systemsUpdate: systemsUpdate,

			bodies: bodies,
			bodiesUpdate: bodiesUpdate
		};
	});

}

// get systems from CAPI
// TODO: Refactor this together with pullAPIData to pull any available schema
export function getSystems() {

	return new Promise(function(resolve, reject) {
		let qlNode = 'systems';
		pullData[qlNode] = [];

		fetchQLData(resolve, reject, 0, systemsSchema, qlNode);
	})

}

// get bodies from CAPI
// TODO: Refactor this together with pullAPIData to pull any available schema
export function getBodies() {

	return new Promise(function(resolve, reject) {
		let qlNode = 'bodies';
		pullData[qlNode] = [];

		fetchQLData(resolve, reject, 0, bodiesSchema, qlNode);
	})

}

// update single body in CAPI
export function updateBody(body) {

	// Get rid of unneeded fields.
	const payload = {...body};
		delete payload.bodyName;
		delete payload.id;
		delete payload.scripCheck;

	const options = {
		method: 'PUT',
		headers: { 
			'Content-Type': 'application/json',
			'Authorization': 'Bearer '+TOKEN
		},
		body: JSON.stringify(payload)
	}

	return fetch(API_UPDATE_BODY+body.id, options).then(r => {

		if(r.status == 200) {
	
			try {
				console.log(' < [CANONN] ('+body.bodyName+') Ok...');
				return r.json();

			} catch(e) {
				console.log(' < [CANONN] ERROR on saving to Canonn API: ');
				console.log('');
				console.log('  Error:', e);
				console.log('');
				console.log('  Payload:', payload);
				console.log('');
			}
	
		} else {
			console.log(' < [CANONN] ERROR Response status ', r.status);
		}

	});

}

// update single system in CAPI
export function updateSystem(system) {

	// Get rid of unneeded fields.
	const payload = { ...system };
		delete payload.systemName;
		delete payload.id;
		delete payload.scripCheck;

	const options = {
		method: 'PUT',
		headers: { 
			'Content-Type': 'application/json',
			'Authorization': 'Bearer '+TOKEN
		},
		body: JSON.stringify(payload)
	}

	return fetch(API_UPDATE_SYSTEM+system.id, options).then(r => {

		if(r.status == 200) {
	
			try {
				console.log(' < [CANONN] ('+system.systemName+') Ok...');
				return r.json();

			} catch(e) {
				console.log(' < [CANONN] ERROR on saving to Canonn API: ');
				console.log('');
				console.log('  Error:', e);
				console.log('');
				console.log('  Payload:', payload);
				console.log('');
			}
	
		} else {
			console.log(' < [CANONN] ERROR Response status ', r.status);
		}

	});

}