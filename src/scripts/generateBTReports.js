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

/*
	THIS IS FOR TESTING ONLY
	Generates some random BT reports for testing
	Reports have a chance to be incorrect and a chance of being a duplicate

	Usage:
	npm run updater generateBTReports:[NUMBER_OF_REPORTS_TO_GENERATE]
*/

const INCORRECT_FIELDS = [
	'type',
	"systemName",
	"bodyName",
	"cmdrName"
]

export default function generateBTReports(runtime) {
	return new Promise(async function(resolve,reject) {

		const incorrectChance = 0.25; 	// [0-1] chance of report being incorrect
		const duplicateChance = 0.15; 	// [0-1] chance of report being a duplicate
		let reportsToGenerate = 20;		// this is overriden by :[X] filter on runtime

			if(runtime.ids) {
				reportsToGenerate = runtime.ids[0];
			}

		UI_header('Random BT Reports generator');
		console.log('Reports to generate: '+reportsToGenerate);
		console.log('Chance of incorrect report: '+(incorrectChance*100)+'%');
		console.log('Chance of duplicate report: '+(duplicateChance*100)+'%');
		console.log();

		console.log('<- Fetching data from CAPI');

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

		console.log('-> Ok...');

		const btreports = data[0];
		const btsites = data[1];
		const cmdrs = data[2];
		const excludecmdrs = data[3];
		const excludeclients = data[4];
		const systems = data[5];
		const bodies = data[6];
		const bttypes = data[7];

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

				UI_h2('#'+reportCounter+': (Seed: '+random+') Generating new report [ incorrect: '+incorrect+', duplicate:'+duplicate+' ]');

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

				let sourceBT = btsites[ Math.floor(random*btsites.length) ];
				console.log('BT Site used as source = ID:'+sourceBT.id);

				report.systemName = sourceBT.system.systemName;
				report.bodyName = sourceBT.body.bodyName;
				
				let newType = bttypes[ Math.floor(random*bttypes.length) ].journalName;
				console.log('Type for this report: ', newType);
				report.type = newType;

				report.latitude = sourceBT.latitude;
				report.longitude = sourceBT.longitude;

				if(!duplicate) {
					report.clientVersion = 'Updater RRG - New';
					report.latitude = random*sourceBT.latitude;
					report.longitude = random*sourceBT.longitude;
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

				await CAPI_update('btreports', report);

				reportCounter++;

			}
		})();

		resolve(true);
	});
}