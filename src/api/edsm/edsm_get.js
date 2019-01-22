/*
	These are all the EDSM fetch methods to be used with EDSM_fetch(type, data) function.

	Each of these endpoints below also has a data parameter.
	baseData is automatically added to each fetch.
	The comment part of data is what you need to supply for EDSM_fetch(type, data).

	For details on those parameters see EDSM API:
	See API at: https://www.edsm.net/en/api-system-v1
*/

import { API_EDSM_URL } from '../../settings';

const EDSM_GET = {

	'systems': {
		url: API_EDSM_URL+'/api-v1/systems',
		baseData: { showCoordinates: true, showInformation: true, showId: true }
		// EDSM_fetch(type, data) POST data required: { systemName: ["Sol", "Maia",...] }
	},

	'bodies': {
		url: API_EDSM_URL+'/api-system-v1/bodies',
		baseData: { showCoordinates: true, showInformation: true, showId: true }
		// EDSM_fetch(type, data) POST data required: { systemName: "Sol" }
	},

	'stations': {
		url: API_EDSM_URL+'/api-system-v1/stations',
		baseData: { showCoordinates: true, showInformation: true, showId: true }
		// EDSM_fetch(type, data) POST data required: { systemName: "Sol" }
	},

	'factions': {
		url: API_EDSM_URL+'/api-system-v1/factions',
		baseData: { showCoordinates: true, showInformation: true, showId: true }
		// EDSM_fetch(type, data) POST data required: { systemName: "Sol" }
	},

	'systemsInRadius': {
		url: API_EDSM_URL+'/api-v1/sphere-systems',
		baseData: { showCoordinates: true, showInformation: true, showId: true }
		// EDSM_fetch(type, data) POST data required: { systemName: "Sol" }
		// EDSM_fetch(type, data) POST data optional: { minRadius: 0, radius: 100, x: 0, y: 0, z: 0 }
	} 


};

export default EDSM_GET;