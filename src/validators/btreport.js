import { EDSM_fetch } from '../api/api';

/*
	Checks if a BTReport is valid
*/

export default async function validateBTReport(report, { systems = [], bodies = [], cmdrs = [], excludecmdrs = [], excludeclients = [], bttypes = [] } ) {

	let reportValid = true;
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

		//Verify correct BT type
		if( report.type && bttypes.find( type => {
	
			if( type.type.toLowerCase() == report.type.toLowerCase() ) {
				return type;
			} else if ( type.journalName.toLowerCase() == report.type.toLowerCase() ) {
				return type;
			} else {
				return false;
			}
	
		})) {
			console.log(' - [PASS] BT type OK');
		} else {
			reportValid = false;
			invalidReason.push('[DECLINE] Type not found in BTTypes');
			console.log(' - [DECLINE] Type not found in BTTypes');
		}

	} else {
		reportValid = false;
		invalidReason.push('[DECLINE] Missing type');
		console.log(' - [DECLINE] Missing type');
	}



	if(report.cmdrName) {

		// Verify CMDR is in our db
		if( report.cmdrName && cmdrs.find( cmdr => {
			return cmdr.cmdrName.toLowerCase() == report.cmdrName.toLowerCase();
		})) {
    		console.log(' - [PASS] CMDR is in CAPI');
    		missingData.cmdr = false;
		} else {
			console.log(' - [SKIP] CMDR is not in CAPI');
			missingData.cmdr = { cmdrName: report.cmdr }
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


	if(report.systemName && report.bodyName) {

		// Check if the 'systemName' and 'bodyName' exists in our database
		if( systems.find( system => {
			return system.systemName.toLowerCase() == report.systemName.toLowerCase();
		})) {
    		console.log(' - [PASS] System in CAPI');
    		missingData.system = false;
	
    		// Check if the `bodyName` exists in our database
			if( bodies.find( body => {
				return body.bodyName.toLowerCase() == report.bodyName.toLowerCase();
			})) {
    			console.log(' - [PASS] Body in CAPI');
    			missingData.body = false;
			} else {
				console.log(' - [SKIP] Body not in CAPI');
			}
	
		} else {
			console.log(' - [SKIP] System not in CAPI');
		}
	
		// Check if the 'systemName' and 'bodyName' exists in EDSM
		if(missingData.system || missingData.body) {
	
			console.log();
			let edsm_check = await EDSM_fetch('bodies', { systemName: report.systemName });
			console.log();
		
			if(edsm_check && edsm_check[0] && edsm_check[0].id) {
				let edsm_system = edsm_check[0];
		
				if(missingData.system) {
					missingData.system = edsm_system;
				}
		
				console.log(' - [PASS] System exists in EDSM.');
		
				if(edsm_system.bodies && edsm_system.bodies.length > 0) {
					let edsm_body = edsm_system.bodies.find( body => {
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
		missingData: missingData,
		invalidReason: invalidReason
	}
	
}