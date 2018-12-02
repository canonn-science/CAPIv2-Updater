const fetch = require("node-fetch");

import systemsQL from '../schemas/systems.js';
import bodiesQL from '../schemas/bodies.js';

import { API_CANONN_STEP } from '../settings.js';

const API_AUTH = 'https://api.canonn.tech:2053/auth/local';
const API_GRAPHQL = 'https://api.canonn.tech:2083/graphql';
const API_UPDATE_SYSTEM = 'https://api.canonn.tech:2083/systems/';
const API_UPDATE_BODY = 'https://api.canonn.tech:2083/bodies/';

const pullData = {};
var TOKEN = null;

export function authenticate(username, password) {

	console.log('Authenticating with Canonn API...')

	const options = {
		method: 'POST',
		headers: { 
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			identifier: username,
			password: password
		})
	}

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
			console.log('[FORBIDDEN] Authentication failed. Check your usernam/password in .env');
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

	const API_URL = 'https://api.canonn.tech:2083/graphql';
	const options = {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' }
	}

	fetch(API_URL, {
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

	console.log(' > [CANONN] Updating body... ', body.bodyName);
	console.log(' > TOKEN ', TOKEN);

	// Get rid of unneeded fields.
	const payload = {...body};
		delete payload.bodyName;
		delete payload.id;

	const options = {
		method: 'PUT',
		headers: { 
			'Content-Type': 'application/json',
			'Authorization': 'Bearer '+TOKEN
		},
		body: JSON.stringify(payload)
	}

	return fetch(API_UPDATE_BODY+body.id, options).then(r => {

		console.log('')
		console.log('response')
		console.log(r);
		console.log('')

		if(r.status == 200) {
	
			try {
				const resp = r.json();

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