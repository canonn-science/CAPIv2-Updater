
import validateReport from '../../validators/report';
import site_from_report from '../../updaters/site_from_report';

import { CAPI_fetch, CAPI_update, EDSM_fetch } from '../../api/api';
import { LOCALE, TIMEZONE, REPORT_STATUS } from '../../settings';

// Import UI console printers for consistent script look
import { 
	UI_header, 
	UI_footer, 
	UI_h2,
	UI_singleHr
} from '../../ui';

// Max allowed difference between report and site lat/lng for the report to be 
// considered a duplicate of existing site.
const LATITUDE_DIFF = 1;
const LONGITUDE_DIFF = 1;

export default function site_from_reportScript( 
	runtime, 
	{
		code = null,
		reports = [], 
		types = [], 
		sites = [],
		validator = validateReport,
		updater = site_from_report 
	}
) {

	return new Promise(async function(resolve,reject) {

		if( !code ) {
			console.log('[ERROR] Code not specified (bt, fm, etc...).');
			resolve(true);
		}

		let reportsEndpoint = code+'reports';
		let sitesEndpoint = code+'sites';

		UI_h2('Fetching data from CAPI');

		const data = await Promise.all([

			CAPI_fetch('cmdrs'),
			CAPI_fetch('excludecmdrs'),
			CAPI_fetch('excludeclients'),
			CAPI_fetch('systems'),
			CAPI_fetch('bodies')

		]);

		UI_h2('Data fetched:');

		const cmdrs = data[0];
		const excludecmdrs = data[1];
		const excludeclients = data[2];
		const systems = data[3];
		const bodies = data[4];

		console.log('Systems: '+systems.length);
		console.log('Bodies: '+bodies.length);
		
		console.log();
		console.log('Pending reports: '+reports.length);
		console.log('Sites: '+sites.length);

		console.log();
		console.log('CMDRS: '+cmdrs.length);
		console.log('CMDRS (Blacklisted): '+excludecmdrs.length);
		console.log('Clients (Blacklisted): '+excludeclients.length);

		for( const report of reports ) {

			UI_h2('Processing "'+report.reportType+'" report ID:'+report.id+' by CMDR '+report.cmdrName);
			console.log('Prechecking validity...');

			//
			// Preprocessing checks for report validity
			//

			let precheck = await validateReport(report, {
				systems: systems, 
				bodies: bodies, 
				cmdrs: cmdrs, 
				excludecmdrs: excludecmdrs, 
				excludeclients: excludeclients,
				types: types
			})

			if(!precheck.valid) {
				console.log();
				console.log('Precheck complete. Report is INVALID.');
				console.log('Changing report status to "declined"...');

				// Update report status here.
				await CAPI_update(reportsEndpoint, {
					id: report.id,
					reportStatus: REPORT_STATUS.declined,
					reportComment: precheck.invalidReason.join("\r\n")
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
				let type;

				// Check system and add it if needed
				if( precheck.missingData.system ) {
					console.log(' [MISS] EDSM System: ', precheck.missingData.system.name);
					let newsystem = await CAPI_update('systems', { edsmsystem: precheck.missingData.system });

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
				if( precheck.missingData.body && system ) {
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

				console.log();

				// Loop over sites and check duplicates
				UI_h2('Looking for duplicates in existing sites');
				console.log();

				let duplicate = false;

				let sameBody = sites.filter( site => {
					return site.body.bodyName.toLowerCase() == report.bodyName.toLowerCase();
				});

				console.log('Sites found on the same body ['+report.bodyName+']: '+sameBody.length);
				if(sameBody.length > 0) {
					// May still be a duplicate

					sameBody.forEach( site => {

						if( Math.abs(site.latitude - report.latitude) <= LATITUDE_DIFF ) {

							if( Math.abs(site.longitude - report.longitude) <= LONGITUDE_DIFF ) {

								duplicate = site;

							}

						}

					});

				}

				if(duplicate) {

					UI_h2('[DUPLICATE] Site was found to be a duplicate of site ID:'+duplicate.id);
					console.log('Updating report...');
					await CAPI_update(reportsEndpoint, {
						id: report.id,
						site: duplicate.id,
						reportStatus: REPORT_STATUS.accepted,
						reportComment: '[DUPLICATE] Report points to an existing site: #'+duplicate.id
					})

				} else {

					UI_h2('[NEW SITE] Site is not a duplicate.');
					console.log('Adding new site...');

					// Get max site ID number
					let maxSiteID = 0;
					sites.forEach( site => {
						if(site.siteID > maxSiteID) {
							maxSiteID = site.siteID;
						}
					});

					// Then add one.
					maxSiteID++;

					// Set correct type for this report
					type = types.find( type => {
						if( type.type.toLowerCase() == report.type.toLowerCase() || type.journalName.toLowerCase() == report.type.toLowerCase() ) {
							return type;
						}
					});

					// Prepare basics for new site
					let payload_site = {
						siteID: maxSiteID,
						system: system.id,
						body: body.id,
						type: type.id,
						discoveredBy: cmdr.id
					}

					let newSite = await CAPI_update(sitesEndpoint, { site: payload_site, report: report }, { updater: site_from_report });

					// Add new site locally
					sites.push({
						...newSite[0],
						body: body,
						system: system,
						type: type,
						discoveredBy: cmdr
					});

					console.log();
					console.log('Updating Report...');

					// Set report to accepted
					await CAPI_update(reportsEndpoint, {
						id: report.id,
						site: newSite[0].id,
						reportStatus: REPORT_STATUS.accepted,
						reportComment: '[ACCEPTED] On: '+ (new Date().toLocaleString(LOCALE, { timeZone: TIMEZONE }) )+' / '+TIMEZONE
					});

					console.log();

				}


				/*
				// Uncomment this for a delay after report pushing
				// useful for anlysis of data
				console.log('(for testing purposes) Waiting 20s...');
				await new Promise( (resolve) => {
					setTimeout(resolve, 20000);
				});
				*/
				

			}

			UI_h2('[COMPLETE] Report ID:'+report.id+' is complete.');

		}

		resolve(true);
	});
}