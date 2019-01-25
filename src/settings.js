// SCRIPT

// Timedate formats for dates in updater
// For more info see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString
export const LOCALE = 'en-US';
export const TIMEZONE = 'America/Phoenix';


// APIs in general

// Time to wait if 429 code is encountered
export const ERR429_DELAY = 300000 // 5 min


// EDSM

// EDSM API url
export const API_EDSM_URL = 'https://www.edsm.net';

// delay in [ms] for EDSM calls
export const EDSM_DELAY = 1500;

// max number of systems in one call for EDSM
export const EDSM_MAX_CALL_STACK = 25;


// CANONN & CAPI

// Canonn API urls - This is currently configured to work on a temporary test server
export const API_CANONN_GRAPHQL = 'https://api.canonn.tech:2083/graphql';
export const API_CANONN_REST = 'https://api.canonn.tech:2083';

// max limit per one GraphQL query for Canonn API
// consult with your nearest Canonn API admin
export const API_CANONN_STEP = 1000; 

// delay in [ms] for CAPI calls
export const API_CANONN_DELAY = 25;

// For local copy of Canonn API v2 Only, uncomment if you are building a seed file
//export const API_CANONN_GRAPHQL = 'http://localhost:1337/graphql';
//export const API_CANONN_REST = 'http://localhost:1337';

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
	issue: "issue"
}