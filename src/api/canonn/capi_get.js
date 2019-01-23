/*
	These are all the CAPI fetch methods to be used with CAPI_fetch(type, data) function.
*/

// Schemas for GET requests
import apiupdatesSchema from '../schemas/apiupdates';
import lastApiUpdateSchema from '../schemas/lastapiupdate';

import systemsSchema from '../schemas/systems';
import bodiesSchema from '../schemas/bodies';

import btsitesSchema from '../schemas/btsites';
import btreportsSchema from '../schemas/btreports';
import bttypesSchema from '../schemas/bttypes';

import cmdrsSchema from '../schemas/cmdrs';
import excludecmdrsSchema from '../schemas/excludecmdrs';
import excludeclientsSchema from '../schemas/excludeclients';

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



	'btsites': {
		schema: btsitesSchema,
		graphQLNode: 'btsites'
		//updaterNode: 'bodies'
	},

	'btreports': {
		schema: btreportsSchema,
		graphQLNode: 'btreports'
		//updaterNode: 'bodies'
	},

	'bttypes': {
		schema: bttypesSchema,
		graphQLNode: 'bttypes'
		//updaterNode: 'bodies'
	},

	/* API UPDATES */

	'lastApiUpdate': {
		schema: lastApiUpdateSchema,
		graphQLNode: 'apiupdates'
		//updaterNode: 'lastUpdate'
	},

	'apiupdates': {
		schema: apiupdatesSchema,
		graphQLNode: 'apiupdates'
		//updaterNode: 'lastUpdate'
	},

	/* CMDRS */

	'cmdrs': {
		schema: cmdrsSchema,
		graphQLNode: 'cmdrs'
		//updaterNode: 'bodies'
	},

	// blacklist
	'excludecmdrs': {
		schema: excludecmdrsSchema,
		graphQLNode: 'excludecmdrs'
		//updaterNode: 'bodies'
	},

	// Clients blacklist
	'excludeclients': {
		schema: excludeclientsSchema,
		graphQLNode: 'excludeclients'
		//updaterNode: 'bodies'
	},


};

export default CAPI_GET;