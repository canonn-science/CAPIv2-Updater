// Timedate formats for dates in updater
// For more info see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString
export const LOCALE = 'en-US';
export const TIMEZONE = 'America/Phoenix';

// max limit per one GraphQL query for Canonn API
// consult with your nearest API admin
export const API_CANONN_STEP = 1000; 

// delay in [ms] for EDSM calls
export const EDSM_DELAY = 1500;

// max number of systems in one call for EDSM
export const EDSM_MAX_CALL_STACK = 25;

// Canonn API urls - This is currently configured to work on a temporary test server
export const API_CANONN_GRAPHQL = 'https://api.canonn.tech:2083/graphql';
export const API_CANONN_REST = 'https://api.canonn.tech:2083';

// For local copy of Canonn API v2 Only, uncomment if you are building a seed file
//export const API_CANONN_GRAPHQL = 'http://localhost:1337/graphql';
//export const API_CANONN_REST = 'http://localhost:1337';