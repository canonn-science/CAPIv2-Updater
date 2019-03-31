// That's all the data fetching and data updating you should ever need.
import { CAPI_fetch, CAPI_update, EDSM_fetch } from '../../api/api';

// Import UI console printers for consistent script look
import { 
	UI_h2
} from '../../ui';

/*
	THIS IS FOR TESTING ONLY
	Generates some random reports for testing
	Reports have a chance to be incorrect and a chance of being a duplicate

	TYPES:
	[bm,bt,cs,fg,fm,gv,ls,tw]

	// I think the rest are just missing in capi_get.js

	USAGE:
	npm run updater generateBTReports;[TYPE,TYPE...];{number:10,incorrect_chance:0.25,duplicate_chance:0.15}
*/

const INCORRECT_FIELDS = [
	'type',
	"systemName",
	"bodyName",
	"cmdrName"
]

export default function generateReports(runtime) {
	return new Promise(async function(resolve,reject) {

		let incorrectChance = 0.35; 	// [0-1] chance of report being incorrect
		let duplicateChance = 0.15; 	// [0-1] chance of report being a duplicate
		let reportsToGenerate = 5;		// this is overriden by :[X] filter on runtime

		if(runtime.params) {

			if(runtime.params.number) {
				reportsToGenerate = runtime.params.number;
			}

			if(runtime.params.incorrect_chance) {
				incorrectChance = runtime.params.incorrect_chance
			}

			if(runtime.params.duplicate_chance) { 
				duplicateChance = runtime.params.duplicate_chance
			}
		}

		if(runtime.ids && runtime.ids.length > 0) {

			UI_h2('Random Reports generator');
			console.log('Reports to generate: '+reportsToGenerate);
			console.log('Chance of incorrect report: '+(incorrectChance*100)+'%');
			console.log('Chance of duplicate report: '+(duplicateChance*100)+'%');
			console.log();

			// For each report code generate random reports
			for( const reportCode of runtime.ids ) {

				const sitesToFetch = reportCode+'sites';
				const reportsToFetch = reportCode+'reports';
				const typesToFetch = reportCode+'types';	

				console.log();
				UI_h2('Generating report type: ['+reportsToFetch+']');
				console.log('<- Fetching ['+reportsToFetch+'] data from CAPI');
		
				const data = await Promise.all([
		
					CAPI_fetch(reportsToFetch, {
						where: {
							"reportStatus": "pending",
    						//"isBeta": "false"			// uncomment this once it's confirmed working.
						}
					}),
					CAPI_fetch(sitesToFetch),
					CAPI_fetch(typesToFetch)
		
				]);
		
				const reports = data[0];
				const sites = data[1];
				const types = data[2];
		
				let reportCounter = 0;
		
				await (async () => {
					while(reportCounter<reportsToGenerate) {
		
						let random = Math.random();
		
						let incorrect = false;
						let duplicate = false;
		
						if( random <= incorrectChance ) {
							incorrect = true;
						} else if( random > incorrectChance && random < incorrectChance+duplicateChance ) {
							duplicate = true;
						}
		
						UI_h2('#'+reportCounter+': (Seed: '+random+') Generating new ['+reportsToFetch+'] report [ incorrect: '+incorrect+', duplicate:'+duplicate+' ]');
		
						const report = {
							userType: 'pc',
							cmdrName: 'Vall',
							reportType: 'new',
							clientVersion: 'Updater RRG - Duplicate',
							reportStatus: 'pending',
		
							type: '',
							systemName: '',
							bodyName: '',
							latitude: 0,
							longitude: 0
						}
		
						let source = sites[ Math.floor(random*sites.length) ];
						console.log('Site used as source = ID:'+source.id);
		
						report.systemName = source.system.systemName;
						report.bodyName = source.body.bodyName;
						
						let newType = types[ Math.floor(random*types.length) ].journalName;
						console.log('Type for this report: ', newType);
						report.type = newType;
		
						report.latitude = source.latitude;
						report.longitude = source.longitude;
		
						if(!duplicate) {
							report.clientVersion = 'Updater RRG - New';
							report.latitude = random*source.latitude;
							report.longitude = random*source.longitude;
						}
		
						if(incorrect) {
							let incorrectField = INCORRECT_FIELDS[ Math.floor(random*INCORRECT_FIELDS.length) ];
							console.log('Incorrect field: '+incorrectField);
		
							report.clientVersion = 'Updater RRG - Incorrect';
		
							if(incorrectField == 'cmdrName') {
								report['cmdrName'] = 'test';
							} else {
								report[incorrectField] = 'Incorrect';
							}
						}
		
						await CAPI_update(reportsToFetch, report);
		
						reportCounter++;
		
					}
				})();

			}

		}

		resolve(true);
	});
}