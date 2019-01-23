// That's all the data fetching and data updating you should ever need.
import { CAPI_fetch, CAPI_update, EDSM_fetch } from '../api/api';

import validateBody from '../validators/body';

// Import UI console printers for consistent script look
import { 
	UI_header, 
	UI_footer, 
	UI_h2,
	UI_singleHr
} from '../ui';


export default function bodiesScript(runtime) {
	return new Promise(async function(resolve,reject) {

		let update;
		let payload = [];

		UI_h2('Fetching Bodies from CAPI');
		let capi_bodies = await CAPI_fetch('bodies');
		let candidates = capi_bodies.filter(validateBody);

		console.log('Total:', capi_bodies.length);
		console.log('Candidates:', candidates.length);

		// Runtime parameters modifiers for this script
		if(runtime.ids) {
			update = runtime.ids.map( id => {
				let body = capi_bodies.find( bdy => {
					return bdy.id == id;
				})

				if(body) {
					return body;
				}
			});
		} else if( runtime.force ) {
			update = capi_bodies;
		} else {
			update = candidates;
		}

		UI_h2('Finding systems to ask EDSM about '+update.length+' bodies.');

		let querySystemNames = [];

		update.forEach( body => {
			if( querySystemNames.indexOf(body.system.systemName) === -1 ) {
				querySystemNames.push(body.system.systemName);
			}
		});

		console.log('Query EDSM for '+querySystemNames.length+' full system info.');

		UI_h2('Fetching Candidate Systems from EDSM');		
		let edsm_systems = await EDSM_fetch('bodies', { 
			systemName: querySystemNames
		});

		UI_header('EDSM full system info fetched: '+edsm_systems.length);
		console.log('<- Updating ['+update.length+'] bodies in CAPI');

		// Loop over EDSM systems, then
		edsm_systems.forEach( edsmsystem => {

			// Filter out only the bodies we're looking for
			let bodies = edsmsystem.bodies;
			bodies.forEach( body => {

				console.log('Body name: ', body.name);

				let capiBody = update.find( capibody => {
					return capibody.bodyName.toLowerCase() == body.name.toLowerCase();
				});

				if(capiBody) {
					payload.push({ capibody: capiBody, edsmbody: body })
				}

			});

		});

		console.log('------- payload', payload);

		await CAPI_update('bodies', payload);			

		resolve(true);
	});
}