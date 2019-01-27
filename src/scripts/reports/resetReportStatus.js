
import { CAPI_fetch, CAPI_update, EDSM_fetch } from '../../api/api';
import { REPORT_STATUS } from '../../settings';

import { 
	UI_h2,
	UI_singleHr
} from '../../ui.js';

export default function resetReportStatus(runtime) {
	return new Promise(async function(resolve,reject) {

		if(runtime.ids && runtime.ids.length > 0) {
	
			for( const reportCode of runtime.ids ) {
	
				const reportsToFetch = reportCode+'reports';

				UI_h2('Resetting ['+reportsToFetch+'] reports status to "pending"');

				let reports = await CAPI_fetch(reportsToFetch);

				console.log('');
				console.log('# Reports: '+reports.length);
				console.log('');
	
				for( const [i,report] of reports.entries() ) {
					
					await CAPI_update(reportsToFetch, {
						id: report.id,
						reportStatus: REPORT_STATUS.pending
					});

					console.log('-> ['+(i+1)+'/'+reports.length+'] ID: '+report.id+' Ok...');
	
				}
	
			}

		}

		resolve(true);

	});
}