
import { CAPI_fetch, CAPI_update, EDSM_fetch } from '../api/api';
import { REPORT_STATUS } from '../settings';

import { 
	UI_header, 
	UI_footer, 
	UI_h2,
	UI_singleHr
} from '../ui.js';

export default function helpScript(runtime) {
	return new Promise(async function(resolve,reject) {

		const btreports = await CAPI_fetch('btreports');

		for( const report of btreports ) {

			console.log('<- Resetting ID:'+report.id+' status to "pending"');
			await CAPI_update('btreports', {
				id: report.id,
				reportStatus: REPORT_STATUS.pending
			});

		}

		resolve(true);
	});
}