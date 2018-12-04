
// max limit per one GraphQL query for Canonn API
// consult with your nearest API admin
export const API_CANONN_STEP = 1000; 

// delay in [ms] for EDSM calls
export const EDSM_DELAY = 1500;

// max number of systems in one call for EDSM
export const EDSM_MAX_CALL_STACK = 25;

// Canonn API urls - This is currently configured to work on a temporary test server
export const API_CANONN_GRAPHQL = 'https://api.canonn.fyi/graphql';
export const API_CANONN_REST = 'https://api.canonn.fyi';

// For local copy of Canonn API v2 Only, uncomment if you are building a seed file
//export const API_CANONN_GRAPHQL = 'http://localhost:1337/graphql';
//export const API_CANONN_REST = 'http://localhost:1337';