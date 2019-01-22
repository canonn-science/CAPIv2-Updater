/*
	This file contains all the Canonn API functions used to communicate with CAPI.
	You SHOULD NOT use these functions in your scripts.
*/

const fetch = require("node-fetch");

import { 
	API_CANONN_STEP,
	API_CANONN_GRAPHQL,
	API_CANONN_REST,
	API_CANONN_DELAY,
	LOCALE, 
	TIMEZONE
} from '../../settings';

const API_AUTH = API_CANONN_REST+'/auth/local/';
var TOKEN = null;


// Authenticate with Canonn API
// See auth login and pass in .env file

export function authenticate(username, password) {

	console.log('<- Authenticating with Canonn API...');

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

					console.log('-> Hello, '+r.user.username);
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


// Get CAPI data from capi_get.js type
// You should use CAPI_fetch() instead of this function.

export function getCAPIData(type, data) {

	// This promise gets resolved inside fetchSingle function
	return new Promise(function(resolve, reject) {

		// Check if there's custom data for graphQL query and apply it to schema
		let whereFilter = QLWhereFilter(data);

		if(whereFilter !== "{}") {
			console.log('<- CAPI_fetch: ['+type.graphQLNode+'] where: '+whereFilter);
		} else {
			console.log('<- CAPI_fetch: ['+type.graphQLNode+']');
		}

		fetchSingle(resolve, reject, 0, type.schema, whereFilter, type.graphQLNode);

	});

}

// Update CAPI data
// You should use CAPI_update() instead of this function.

export function updateCAPIData(type, data, options) {

	// This promise gets resolved inside updateSingle function
	return new Promise(function(resolve, reject) {
		updateSingle(resolve, reject, type, data, options);
	});


}


/* 
-------------------------------------------------
Internal functions - don't use outside this file. 
-------------------------------------------------
*/

// Fetch data from CAPI graphQL in a loop
// This function fires itself in a loop until all data has been downloaded
// After all loops are completed it returns a cumulative data array with everything fetched.

// resolve: resolve from parent Promise (getCAPIData)
// reject: reject from parent Promise (getCAPIData)
// counter: current loop counter for schema 'start, limit' attributes (see schemas)
// schema: schema function for graphQL
// qlNode: graphQL node which contains returned data (see capi_get.js graphQLNode)
// data: cumulative array of data returned from CAPI. This is returned at the end of this function

function fetchSingle(resolve, reject, counter = 0, schema, whereFilter, qlNode = [], data = []) {

	const step = API_CANONN_STEP;
	const query = schema(step, counter, whereFilter);

	return fetch(API_CANONN_GRAPHQL, {	
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			query: query
		})

	}).then( response => {
		
		if(response.ok) {
			return response.json();
		} else {
			throw new Error(response.status);
		}

	}).then( response => {

		data.push( ...response.data[qlNode] );

		if(response.data[qlNode].length == step) {

			// If there is more data to download than API_CANONN_STEP, run same function again
			fetchSingle(resolve, reject, counter+step, schema, whereFilter, qlNode, data);

		} else {

			if(whereFilter !== "{}") {
				console.log('-> CAPI_fetch: ['+qlNode+'] where: '+whereFilter+' ... OK!');
			} else {
				console.log('-> CAPI_fetch: ['+qlNode+'] ... OK!');
			}

			// Resolve getCAPIData promise with cumulative data
			resolve(data);
		}

	}).catch( error => {
		console.log('-> CAPI: Error in response: ', error);
	});

}

// Update data in CAPI REST

// resolve: resolve from parent Promise (getCAPIData)
// reject: reject from parent Promise (getCAPIData)
// type: CAPI_update.js type
// data: object you are trying to update or add
// options: custom updater options, see CAPI_update in api.js

async function updateSingle(resolve, reject, type, data, options) {

	const defaultUpdater = type.updater;

	let payload = data;
	let check = null;

	// Updaters for formatting data before sending
	if(options.updater) {

		// Custom updater from script
		payload = options.updater(data);

	} else {

		// Fall back to default updater
		if(defaultUpdater) {
			payload = defaultUpdater(data);
		}

	}
	
	
	/*console.log('<- Checking if data exists.')
	// Check if object exists in CAPI
	if(data.id) {

		check = await new Promise(function(fetchResolve, fetchReject) {
			fetchSingle(fetchResolve, fetchReject, 0, type.getter.schema, { id: data.id }, type.getter.graphQLNode, []);
		});

	}
	console.log('-> Check: ', check);*/

	if(payload) {

		if(payload.id) {
			// PUT

			let url = type.url+'/'+payload.id;

			delete payload.id;

			console.log('');
			console.log('');
			console.log('');
			console.log(' Payload', payload);
			console.log(' URL', url);
	
			fetch(url, {
				method: 'PUT',
				headers: { 
					'Content-Type': 'application/json',
					'Authorization': 'Bearer '+TOKEN
				},
				body: JSON.stringify({
					query: payload
				})
	
			}).then( response => {
			
				console.log(' Reponse: ', response);

				if(response.ok) {
					console.log('-> Ok...');
					return response.json();
				} else {
					throw new Error(response.status);
				}
		
			}).then( response => {
	
				let t = setTimeout( () => {
	
					resolve(response);
	
				}, API_CANONN_DELAY);
	
			}).catch( error => {
				console.log('-> CAPI: Error in response: ', error);
			});

		} else {
			// POST
	
			console.log('POST REQUEST HERE');
	
		}

	} else {
		reject(' - Updater returned invalid.');
	}

}

// Creates a graphQL "where" filter from data for better query management
// Example usage:
//
//	CAPI_fetch('systems', {
//		where: {
//			"systemName": "Maia"
//		}
//	});

function QLWhereFilter(data) {

	let whereFilter = '{';

		if(data) {

			if(data.where) {

				Object.keys(data.where).forEach( key => {
					whereFilter += key+': "'+data.where[key]+'",';
				});
			}
		}

		whereFilter += '}';

	return whereFilter;

}