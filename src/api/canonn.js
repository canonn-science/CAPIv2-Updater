const fetch = require("node-fetch");

import systemsQL from '../schemas/systems.js';
import bodiesQL from '../schemas/bodies.js';

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
		} else {
			console.log('[ERROR] Status code: ', r.status);
			console.log('...........................................');
		}

	});
}

function fetchQLData(resolve, reject, counter = 0, query, qlNode) {

	const step = API_CANONN_STEP;

	const options = {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' }
	};

	fetch(API_CANONN_GRAPHQL, {
		...options,
		body: JSON.stringify({
			query: query(step, counter)
		})
	})
	.then( r => r.json() )
	.then( r => { 
	
		pullData[qlNode].push( ...r.data[qlNode] );

		if(r.data[qlNode].length == step) {
			fetchQLData(resolve, reject, counter+step, query, qlNode);
		} else {
			resolve(pullData[qlNode]);
		}
	})

}

export function getSystems() {

	return new Promise(function(resolve, reject) {
		let qlNode = 'systems';
		pullData[qlNode] = [];

		fetchQLData(resolve, reject, 0, systemsQL, qlNode);
	})

}

export function getBodies() {

	return new Promise(function(resolve, reject) {
		let qlNode = 'bodies';
		pullData[qlNode] = [];

		fetchQLData(resolve, reject, 0, bodiesQL, qlNode);
	})

}

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