# Canonn-EDSM-Updater

Nodejs based tool to update the Canonn API with planetary and stellar data from EDSM

<!-- TOC -->

- [Canonn-EDSM-Updater](#canonn-edsm-updater)
    - [Requirements](#requirements)
    - [Setup](#setup)
    - [Settings.js](#settingsjs)
    - [Usage](#usage)
        - [status](#status)
        - [updateSystems](#updatesystems)
        - [updateBodies](#updatebodies)
        - [updateAll](#updateall)

<!-- /TOC -->

## Requirements

- node.js >= v10.14.1

## Setup

- clone the repository
- `npm install`
- create `.env` file in main repository directory (See .env.example)
- Build the package with `npm run build`

## Settings.js

Configuration options for the CAPIv2-Updater

```javascript
// Maximum limit of results for Canonn GraphQL API. Consult your Canonn API admin for more information.
// Default: 1000
export const API_CANONN_STEP = 1000; 

// Delay [ms] between EDSM API calls. If it's too small you may get banned from EDSM.
// Default: 3000
export const EDSM_DELAY = 1500;

// Maximum number of Systems pulled in one API call. If it's too big, you may get banned from EDSM.
// Default: 25
export const EDSM_MAX_CALL_STACK = 25;

// Canonn GraphQL server you are trying to reach for updates.
// Default: Canonn Development server
export const API_CANONN_GRAPHQL = 'https://api.canonn.tech:2083/graphql';

// Canonn REST server the data will be saved to.
// Default: Canonn Development server
export const API_CANONN_REST = 'https://api.canonn.tech:2083';
```

## Usage

These are the following commands for running the updater after being built

### status

`npm run status`
Displays basic status of Canonn API

### updateSystems

`npm run updateSystems`
Update all Systems that are candidates

### updateBodies

`npm run updateBodies`
Update all Bodies that are candidates

### updateAll

`npm run updateAll`
Update all systems that are candidates
