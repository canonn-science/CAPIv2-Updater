/*
	These are all the CAPI fetch methods to be used with CAPI_fetch(type, data) function.
*/

// Schemas for GET requests
import apiupdatesSchema from '../schemas/apiupdates';
import lastApiUpdateSchema from '../schemas/lastapiupdate';

import systemsSchema from '../schemas/systems';
import bodiesSchema from '../schemas/bodies';

import cmdrsSchema from '../schemas/cmdrs';
import excludecmdrsSchema from '../schemas/excludecmdrs';
import excludeclientsSchema from '../schemas/excludeclients';

import apsitesSchema from '../schemas/apsites';
import apreportsSchema from '../schemas/apreports';
import aptypesSchema from '../schemas/aptypes';

import bmsitesSchema from '../schemas/bmsites';
import bmreportsSchema from '../schemas/bmreports';
import bmtypesSchema from '../schemas/bmtypes';

import btsitesSchema from '../schemas/btsites';
import btreportsSchema from '../schemas/btreports';
import bttypesSchema from '../schemas/bttypes';

import cssitesSchema from '../schemas/cssites';
import csreportsSchema from '../schemas/csreports';
import cstypesSchema from '../schemas/cstypes';

import fgsitesSchema from '../schemas/fgsites';
import fgreportsSchema from '../schemas/fgreports';
import fgtypesSchema from '../schemas/fgtypes';

import fmsitesSchema from '../schemas/fmsites';
import fmreportsSchema from '../schemas/fmreports';
import fmtypesSchema from '../schemas/fmtypes';

import gvsitesSchema from '../schemas/gvsites';
import gvreportsSchema from '../schemas/gvreports';
import gvtypesSchema from '../schemas/gvtypes';

import gysitesSchema from '../schemas/gysites';
import gyreportsSchema from '../schemas/gyreports';
import gytypesSchema from '../schemas/gytypes';

import lssitesSchema from '../schemas/lssites';
import lsreportsSchema from '../schemas/lsreports';
import lstypesSchema from '../schemas/lstypes';

import tbsitesSchema from '../schemas/tbsites';
import tbreportsSchema from '../schemas/tbreports';
import tbtypesSchema from '../schemas/tbtypes';

import twsitesSchema from '../schemas/twsites';
import twreportsSchema from '../schemas/twreports';
import twtypesSchema from '../schemas/twtypes';

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

	// Amphora Plants
	'apsites': {
		schema: apsitesSchema,
		graphQLNode: 'apsites'
		//updaterNode: 'bodies'
	},

	'apreports': {
		schema: apreportsSchema,
		graphQLNode: 'apreports'
		//updaterNode: 'bodies'
	},

	'aptypes': {
		schema: aptypesSchema,
		graphQLNode: 'aptypes'
		//updaterNode: 'bodies'
	},

	// Bark Mounds
	'bmsites': {
		schema: bmsitesSchema,
		graphQLNode: 'bmsites'
		//updaterNode: 'bodies'
	},

	'bmreports': {
		schema: bmreportsSchema,
		graphQLNode: 'bmreports'
		//updaterNode: 'bodies'
	},

	'bmtypes': {
		schema: bmtypesSchema,
		graphQLNode: 'bmtypes'
		//updaterNode: 'bodies'
	},

	// Brain Trees
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

	// Crystalline Shards
	'cssites': {
		schema: cssitesSchema,
		graphQLNode: 'cssites'
		//updaterNode: 'bodies'
	},

	'csreports': {
		schema: csreportsSchema,
		graphQLNode: 'csreports'
		//updaterNode: 'bodies'
	},

	'cstypes': {
		schema: cstypesSchema,
		graphQLNode: 'cstypes'
		//updaterNode: 'bodies'
	},

	// Fungal Gourds
	'fgsites': {
		schema: fgsitesSchema,
		graphQLNode: 'fgsites'
		//updaterNode: 'bodies'
	},

	'fgreports': {
		schema: fgreportsSchema,
		graphQLNode: 'fgreports'
		//updaterNode: 'bodies'
	},

	'fgtypes': {
		schema: fgtypesSchema,
		graphQLNode: 'fgtypes'
		//updaterNode: 'bodies'
	},

	// Fumaroles
	'fmsites': {
		schema: fmsitesSchema,
		graphQLNode: 'fmsites'
		//updaterNode: 'bodies'
	},

	'fmreports': {
		schema: fmreportsSchema,
		graphQLNode: 'fmreports'
		//updaterNode: 'bodies'
	},

	'fmtypes': {
		schema: fmtypesSchema,
		graphQLNode: 'fmtypes'
		//updaterNode: 'bodies'
	},

	// Gas Vents
	'gvsites': {
		schema: gvsitesSchema,
		graphQLNode: 'gvsites'
		//updaterNode: 'bodies'
	},

	'gvreports': {
		schema: gvreportsSchema,
		graphQLNode: 'gvreports'
		//updaterNode: 'bodies'
	},

	'gvtypes': {
		schema: gvtypesSchema,
		graphQLNode: 'gvtypes'
		//updaterNode: 'bodies'
	},

	// Geysers
	'gysites': {
		schema: gysitesSchema,
		graphQLNode: 'gysites'
		//updaterNode: 'bodies'
	},

	'gyreports': {
		schema: gyreportsSchema,
		graphQLNode: 'gyreports'
		//updaterNode: 'bodies'
	},

	'gytypes': {
		schema: gytypesSchema,
		graphQLNode: 'gytypes'
		//updaterNode: 'bodies'
	},

	// Lava Spouts
	'lssites': {
		schema: lssitesSchema,
		graphQLNode: 'lssites'
		//updaterNode: 'bodies'
	},

	'lsreports': {
		schema: lsreportsSchema,
		graphQLNode: 'lsreports'
		//updaterNode: 'bodies'
	},

	'lstypes': {
		schema: lstypesSchema,
		graphQLNode: 'lstypes'
		//updaterNode: 'bodies'
	},

	// Thargoid Barnacles
	'tbsites': {
		schema: tbsitesSchema,
		graphQLNode: 'tbsites'
		//updaterNode: 'bodies'
	},

	'tbreports': {
		schema: tbreportsSchema,
		graphQLNode: 'tbreports'
		//updaterNode: 'bodies'
	},

	'tbtypes': {
		schema: tbtypesSchema,
		graphQLNode: 'tbtypes'
		//updaterNode: 'bodies'
	},

	// Tube Worms
	'twsites': {
		schema: twsitesSchema,
		graphQLNode: 'twsites'
		//updaterNode: 'bodies'
	},

	'twreports': {
		schema: twreportsSchema,
		graphQLNode: 'twreports'
		//updaterNode: 'bodies'
	},

	'twtypes': {
		schema: twtypesSchema,
		graphQLNode: 'twtypes'
		//updaterNode: 'bodies'
	}

};

export default CAPI_GET;