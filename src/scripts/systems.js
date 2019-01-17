// That's all the data fetching and data updating you should ever need.
import { CAPI_fetch, CAPI_update, EDSM_fetch } from '../api/api';

import validateSystem from '../validators/system';

// Import UI console printers for consistent script look
import { 
	UI_header, 
	UI_footer, 
	UI_h2,
	UI_singleHr
} from '../ui';


export default function systemsScript(runtime) {
	return new Promise(async function(resolve,reject) {

		UI_h2('Fetching Systems from CAPI');
		let capi_systems = await CAPI_fetch('systems');
		let candidate_systems = capi_systems.filter(validateSystem);
		console.log('Total:', capi_systems.length);
		console.log('Candidates:', candidate_systems.length);

		UI_h2('Fetching Candidate Systems from EDSM');		
		let edsm_systems = await EDSM_fetch('systems', { 
			systemName: candidate_systems.map( system => {
				return system.systemName;
			})
		});

		UI_header('EDSM Systems fetched: '+edsm_systems.length);

		resolve(true);
	});
}