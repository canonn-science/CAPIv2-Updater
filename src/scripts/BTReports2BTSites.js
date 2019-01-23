// That's all the data fetching and data updating you should ever need.
import { CAPI_fetch, CAPI_update, EDSM_fetch } from '../api/api';

import validateBTReport from '../validators/btreport';
import { REPORT_STATUS } from '../settings';

// Import UI console printers for consistent script look
import { 
	UI_header, 
	UI_footer, 
	UI_h2,
	UI_singleHr
} from '../ui';


export default function btReports2btSitesScript(runtime) {
	return new Promise(async function(resolve,reject) {

		console.log('O, hai.');

		UI_h2('Fetching data from CAPI');

		const data = await Promise.all([

			CAPI_fetch('btreports', {
				where: {
					"reportStatus": "pending",
    				//"isBeta": "false"			// uncomment this once it's confirmed working.
				}
			}),
			CAPI_fetch('btsites'),
			CAPI_fetch('cmdrs'),
			CAPI_fetch('excludecmdrs'),
			CAPI_fetch('excludeclients'),
			CAPI_fetch('systems'),
			CAPI_fetch('bodies'),
			CAPI_fetch('bttypes'),

		]);

		UI_h2('Data fetched:');

		const btreports = data[0];
		const btsites = data[1];
		const cmdrs = data[2];
		const excludecmdrs = data[3];
		const excludeclients = data[4];
		const systems = data[5];
		const bodies = data[6];
		const bttypes = data[7];

		console.log('Systems: '+systems.length);
		console.log('Bodies: '+bodies.length);
		console.log();
		console.log('BT Reports: '+btreports.length);
		console.log('BT Sites: '+btsites.length);
		console.log('CMDRS: '+cmdrs.length);
		console.log('CMDRS (Blacklisted): '+excludecmdrs.length);
		console.log('Clients (Blacklisted): '+excludeclients.length);

		for( const report of btreports ) {

			UI_h2('Processing "'+report.reportType+'" report ID:'+report.id+' by CMDR '+report.cmdrName);
			console.log('Prechecking validity:');
			console.log();

			//
			// Preprocessing checks for report validity
			//

			let precheck = await validateBTReport(report, {
				systems: systems, 
				bodies: bodies, 
				cmdrs: cmdrs, 
				excludecmdrs: excludecmdrs, 
				excludeclients: excludeclients,
				bttypes: bttypes
			})

			if(!precheck.valid) {
				console.log();
				console.log('Precheck complete. Report is INVALID.');

				// Update btreport status here.
				await CAPI_update('btreports', {
					id: report.id,
					reportStatus: REPORT_STATUS.declined
				})
			} else {

				// If validity passed, continue.
				
				console.log();
				console.log('Precheck complete. Report is VALID.');


				// Check missing data and send post to CAPI
				UI_h2('Checking and updating missing data');

				// These are specific to this one report.
				// If missing, will be updated in next 3 checks
				let system;
				let body;
				let cmdr;

				// Check system and add it if needed
				if( precheck.missingData.system ) {
					console.log(' [MISS] EDSM System: ', precheck.missingData.system.name);
					let newsystem = await CAPI_update('system', { edsmsystem: precheck.missingData.system });

					// Update local systems
					systems.push(newsystem);
					system = newsystem;

				} else {
					console.log(' [OK] System is in CAPI');
					system = systems.find( capisystem => {
						return capisystem.systemName.toLowerCase() == report.systemName.toLowerCase();
					});
				}


				// Check body and add it if needed
				if( precheck.missingData.body ) {
					console.log(' [MISS] EDSM body: ', precheck.missingData.body.name);

					let newbody = await CAPI_update('bodies', { capibody: { system: system.id }, edsmbody: precheck.missingData.body });

					// Update local bodies
					bodies.push(newbody);
					body = newbody;

				} else {
					console.log(' [OK] Body is in CAPI');
					body = bodies.find( capibody => {
						return capibody.bodyName.toLowerCase() == report.bodyName.toLowerCase();
					});
				}


				// Check CMDR and add it if needed
				// Fix this in the morning, look at above
				if( precheck.missingData.cmdr ) {
					console.log(' [MISS] EDSM CMDR: ', precheck.missingData.cmdr);
					let newcmdr = await CAPI_update('cmdr', { cmdr: precheck.missingData.cmdr });

					// Update local cmdr
					cmdrs.push(newcmdr);
					cmdr = newcmdr;

				} else {
					console.log(' [OK] CMDR is in CAPI');
					cmdr = cmdrs.find( capicmdr => {
						return capicmdr.cmdrName.toLowerCase() == report.cmdrName.toLowerCase();
					});
				}


				// Step 7 starts here.
				console.log();
				console.log('Ready for duplicates and sites searching.');
				console.log('This is it for now. WIP.');
				console.log();

				/*await CAPI_update('btreports', {
					id: report.id,
					reportStatus: REPORT_STATUS.accepted
				})*/

			}

		}

		resolve(true);
	});
}