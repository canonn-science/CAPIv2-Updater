# Canonn-EDSM-Updater
#### Nodejs based tool to update the Canonn API with planetary and stellar data from EDSM

## Requirements:
- node.js >= v10.14.1

## Setup:
- clone the repository
- `npm install`
- create `.env` file in main repository directory
- .env contents:
	```
	API_USERNAME=yourUsernameForCanonnAPI
	API_PASSWORD=yourPasswordForCanonnAPI
	```

- Build the package with `npm run build`

### Settings.js


#### API_CANONN_STEP
```API_CANONN_STEP = 1000;```

Maximum limit of results for Canonn GraphQL API. Consult your Canonn API admin for more information.

Default: 1000


#### EDSM_DELAY
```EDSM_DELAY = 3000;```

Delay [ms] between EDSM API calls. If it's too small you may get banned from EDSM.

Default: 3000


#### EDSM_MAX_CALL_STACK
```EDSM_MAX_CALL_STACK = 25```

Maximum number of Systems pulled in one API call. If it's too big, you may get banned from EDSM.

Default: 25


#### API_CANONN_GRAPHQL
```API_CANONN_GRAPHQL = 'https://api.canonn.tech:2083/graphql';```

Canonn GraphQL server you are trying to reach for updates.

Default: Canonn TEST server


#### API_CANONN_REST
```API_CANONN_REST = 'https://api.canonn.tech:2083';```

Canonn REST server the data will be saved to.

Default: Canonn TEST server


## Running:

### status
```npm run status```
Displays basic status of Canonn API

### updateSystems
```npm run updateSystems```
Update all Systems that are candidates

### updateBodies
```npm run updateBodies```
Update all Bodies that are candidates

### updateAll
```npm run updateAll```
Update all systems that are candidates
