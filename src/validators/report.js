import { EDSM_fetch } from '../api/api';

import { DEFAULT_CMDR } from '../settings';

import invalidSystem from './system';
import invalidBody from './body';

/*
	Checks if a Report is valid
*/

export default async function validateReport(report, { types = [], systems = [], bodies = [], cmdrs = [], excludecmdrs = [], excludeclients = [] } ) {

	let reportValid = true;

	let capiSystemToUpdate = false;
	let capiBodyToUpdate = false;

	let missingData = {
		system: true,
		body: true,
		cmdr: true
	}

	const invalidReason = [];

	console.log('Validating Report:');
	console.log();
	console.log(report);
	console.log();


	if(report.type) {

		//Verify correct type
		if( report.type && types.find( type => {
	
			if( type.type.toLowerCase() == report.type.toLowerCase() ) {
				return type;
			} else if ( type.journalName.toLowerCase() == report.type.toLowerCase() ) {
				return type;
			} else {
				return false;
			}
	
		})) {
			console.log(' - [PASS] "type" OK');
		} else {
			reportValid = false;
			invalidReason.push('[DECLINE] Type not found in "types"');
			console.log(' - [DECLINE] Type not found in "types"');
		}

	} else {
		reportValid = false;
		invalidReason.push('[DECLINE] Missing "type"');
		console.log(' - [DECLINE] Missing "type"');
	}



	if(report.cmdrName) {

		// Verify CMDR is in CAPI
		if( report.cmdrName && cmdrs.find( cmdr => {
				return cmdr.cmdrName.toLowerCase() == report.cmdrName.toLowerCase();
			})
		) {
    		console.log(' - [PASS] CMDR is in CAPI');
    		missingData.cmdr = false;
		} else {

			// If report has a CMDR name add a new one
			if(report.cmdrName) {

				console.log(' - [SKIP] CMDR is not in CAPI');
				missingData.cmdr = { cmdrName: report.cmdrName }

			// Use a placeholder CMDR
			} else {

				console.log(' - [WARN] CMDR name not specified in report. Using "zzz_Unknown"');
				report.cmdrName = DEFAULT_CMDR;
				missingData.cmdr = false;

			}

			
		}
	
	
		// Verify CMDR is not on the blacklist
		if( report.cmdrName && excludecmdrs.find( excludecmdr => {
			return excludecmdr.cmdrName.toLowerCase() == report.cmdrName.toLowerCase();
		})) {
			// CMDR is blacklisted
			// 		1.2.1) `reportStatus` = `declined`
    		//		1.2.2) `reportComment` = `CMDR is blacklisted`
	
    		reportValid = false;
    		invalidReason.push('[DECLINE] CMDR is blacklisted');
    		console.log(' - [DECLINE] CMDR is blacklisted');
		} else {
			console.log(' - [PASS] CMDR is not blacklisted');
		}

	} else {
		reportValid = false;
		invalidReason.push('[DECLINE] Missing cmdrName');
		console.log(' - [DECLINE] Missing cmdrName');
	}



	if(report.clientVersion) {

		// Verify Client is not on the blacklist
		if( excludeclients.find( excludeclient => {
			return excludeclient.version.toLowerCase() == report.clientVersion.toLowerCase();
		})) {
			// Client is blacklisted
			// 		1.2.1) `reportStatus` = `declined`
    		//		1.2.2) `reportComment` = `Client Version is blacklisted`
	
    		reportValid = false;
    		invalidReason.push('[DECLINE] Client version is blacklisted');
    		console.log(' - [DECLINE] Client version is blacklisted');
		} else {
			console.log(' - [PASS] Client is not blacklisted');
		}

	} else {
		reportValid = false;
		invalidReason.push('[DECLINE] Missing clientVersion');
		console.log(' - [DECLINE] Missing clientVersion');
	}


	if( report.latitude == 0 && report.longitude == 0 ) {

		reportValid = false;
		invalidReason.push('[DECLINE] lat/lng both equal 0');

	}


	if(report.systemName && report.bodyName) {

		// Check if the 'systemName' and 'bodyName' exists in our database
		let capiSystem = systems.find( system => {
			return system.systemName.toLowerCase() == report.systemName.toLowerCase();
		});

		if( capiSystem ) {

			if( !invalidSystem(capiSystem) ) {
				console.log(' - [PASS] System in CAPI');
				missingData.system = false;

			} else {
				console.log(' - [NEED] System is in CAPI but needs an update');
				capiSystemToUpdate = capiSystem;
			}
	
    		// Check if the `bodyName` exists in our database
    		let capiBody = bodies.find( body => {
				return body.bodyName.toLowerCase() == report.bodyName.toLowerCase();
			});

    		if( capiBody ) {

				if( !invalidBody(capiBody) ) {
    				console.log(' - [PASS] Body in CAPI and is valid');
    				missingData.body = false;
    			} else {
						console.log(' - [NEED] Body is in CAPI but needs an update');
						capiBodyToUpdate = capiBody;
    			}

			} else {
				console.log(' - [SKIP] Body not in CAPI');
			}
	
		} else {
			console.log(' - [SKIP] System not in CAPI');
		}
	
		// Check if the 'systemName' and 'bodyName' exists in EDSM
		if(missingData.system || missingData.body) {
	
			console.log();
			let edsm_system_check = await EDSM_fetch('systems', { systemName: report.systemName });
			let edsm_body_check = await EDSM_fetch('bodies', { systemName: report.systemName });
			console.log();
		
			if(edsm_system_check && edsm_system_check[0] && edsm_system_check[0].id) {
				let edsm_system = edsm_system_check[0];
		
				if(missingData.system) {
					missingData.system = edsm_system;
				}
		
				console.log(' - [PASS] System exists in EDSM.');
		
				if(edsm_body_check && edsm_body_check[0] && edsm_body_check[0].bodies && edsm_body_check[0].bodies.length > 0) {
					
					let edsm_body = edsm_body_check[0].bodies.find( body => {
						return body.name.toLowerCase() == report.bodyName.toLowerCase();
					});
		
					if(edsm_body) {
						if(missingData.body) {
							missingData.body = edsm_body;
						}
    					console.log(' - [PASS] Body exists in EDSM.');
					} else {
						reportValid = false;
						invalidReason.push('[DECLINE] Body does not exist in EDSM.');
							console.log(' - [DECLINE] Body does not exist in EDSM.');
					}
				} else {
					reportValid = false;
					invalidReason.push('[DECLINE] Body does not exist in EDSM.');
						console.log(' - [DECLINE] Body does not exist in EDSM.');
				}
		
			} else {
				reportValid = false;
				invalidReason.push('[DECLINE] System does not exist in EDSM.');
    			console.log(' - [DECLINE] System does not exist in EDSM.');
			}
	
		}

	} else {
		reportValid = false;
		invalidReason.push('[DECLINE] Missing systemName / bodyName.');
		console.log(' - [DECLINE] Missing systemName / bodyName.');
	}


	return {
		valid: reportValid,

		capiSystemToUpdate: capiSystemToUpdate,
		capiBodyToUpdate: capiBodyToUpdate,

		missingData: missingData,

		invalidReason: invalidReason
	}
	
}