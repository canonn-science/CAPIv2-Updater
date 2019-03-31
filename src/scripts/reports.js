/*

	This is the entry script to validate reports and create sites from them.

*/
import { CAPI_fetch } from '../api/api';
import { REPORT_STATUS } from '../settings';

import site_from_reportScript from './reports/site_from_report';


// Import UI console printers for consistent script look
import { 
	UI_header
} from '../ui';

export default function reportsScript(runtime) {
	return new Promise(async function(resolve,reject) {

		if(runtime.ids && runtime.ids.length > 0) {

			for( const index in runtime.ids ) {

				let code = runtime.ids[index];

				UI_header('Verifying ['+code+'] reports.');

				let sites = await CAPI_fetch( code+'sites' );
				let reports = await CAPI_fetch( code+'reports', {
					where: {
						"reportStatus": REPORT_STATUS.pending
					}
				});
				let types = await CAPI_fetch( code+'types' );

				await site_from_reportScript(runtime, {
					code: code,
					reports: reports,
					sites: sites,
					types: types
				});				


			}

		} else {

			console.log();
			console.log('No reports to update specified at runtime.');
			console.log('Use: "npm run updater reports:[bt,fm,...]" ');
			console.log();

		}

		resolve(true);
	});
}