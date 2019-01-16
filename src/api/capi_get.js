/*
	These are all the CAPI fetch methods to be used with CAPI_fetch(type, data) function.
*/

// Schemas for GET requests
import lastApiUpdateSchema from './schemas/lastapiupdate.js';

import systemsSchema from './schemas/systems.js';
import bodiesSchema from './schemas/bodies.js';

/*
	These are all the CAPI fetch methods to be used with CAPI_fetch(type, data) function.
	Example:

		CAPI_fetch('systems')

	You can also use filtering with graphQL "where" parameter.
	Example:

		CAPI_fetch('systems', {
			where: {
				"systemName": "Sol"
			}
		});

		Will return SOL system, or [] if not found in CAPI.
		You can use this to check for duplicates and such.

*/

const CAPI_GET = {

	// Use this as a template for a new data fetcher

	// name of getter == type, has to be unique
	// this is used in CAPI_fetch(TYPE) function
	'systems': {

		// schema to send to STRAPI graphql in POST request
		schema: systemsSchema,

		// graphql node of STRAPI returning data. See the response from the schema
		graphQLNode: 'systems',

		// UPDATE object node to which response data will be written (see src/index.js)
		// If you don't want to write it to UPDATE object just pass null (see below)
		// CURRENTLY NOT USED, SAVED FOR FUTURE DEVELOPMENT
		//updaterNode: 'systems'

	},

	'bodies': {
		schema: bodiesSchema,
		graphQLNode: 'bodies'
		//updaterNode: 'bodies'
	},

	'lastApiUpdate': {
		schema: lastApiUpdateSchema,
		graphQLNode: 'apiupdates'
		//updaterNode: 'lastUpdate'
	}


};

export default CAPI_GET;