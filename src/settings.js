/* 
===================
= Script Settings =
===================
*/

//Timedate formats for dates in updater
//For more info see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString
export const LOCALE = 'en-US';
export const TIMEZONE = 'America/Phoenix';


/* 
================
= API Settings =
================
*/

/* EDSM Options */
// EDSM API url
export const API_EDSM_URL = 'https://www.edsm.net';

// delay in [ms] for EDSM calls
export const EDSM_DELAY = 1500;

// max number of systems in one call for EDSM
export const EDSM_MAX_CALL_STACK = 25;

// Time to wait if 429 code is encountered
export const ERR429_DELAY =  300000; // 5 min


/* Canonn APIv2 Options */

// Canonn API urls - This is currently configured to work on the development server
export const API_CANONN_GRAPHQL = 'https://api.canonn.tech:2083/graphql';
export const API_CANONN_REST = 'https://api.canonn.tech:2083';
//export const API_CANONN_GRAPHQL = 'http://localhost:1339/graphql';
//export const API_CANONN_REST = 'http://localhost:1339';

// max limit per one GraphQL query for Canonn API
// consult with your nearest Canonn API admin
export const API_CANONN_STEP = 1000; 

// delay in [ms] for CAPI calls
export const API_CANONN_DELAY = 25;

// Duplication checking distance in kilometers
export const MIN_DISTANCE = 5;

// Enums for report types and statuses - see Strapi CAPI (he_he_he) enums, they should be the same.
export const REPORT_TYPES = {
	new: "new",
	update: "update",
	error: "error"
}

export const REPORT_STATUS = {
	pending: "pending",
	updated: "updated",
	verified: "verified",
	accepted: "accepted",
	declined: "declined",
	issue: "issue",
	duplicate: "duplicate"
}

export const DEFAULT_CMDR = 'zzz_Unknown';