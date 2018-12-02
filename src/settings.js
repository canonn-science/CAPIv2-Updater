
// max limit per one GraphQL query for Canonn API
// consult with your nearest API admin
export const API_CANONN_STEP = 1000; 

// delay in [ms] for EDSM calls
export const EDSM_DELAY = 3000;

// max number of systems in one call for EDSM
export const EDSM_MAX_CALL_STACK = 25;

// Canonn API urls - change this if you want to update test/stage/prod
export const API_CANONN_GRAPHQL = 'https://api.canonn.tech:2083/graphql';
export const API_CANONN_REST = 'https://api.canonn.tech:2083';