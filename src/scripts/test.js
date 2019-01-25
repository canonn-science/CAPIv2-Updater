/*
	This is a script used for testing purpuses only
*/



import { CAPI_fetch, CAPI_update, EDSM_fetch } from '../api/api';

import SCRIPTS from './index';
import CAPI_GET from '../api/canonn/capi_get';

import { 
	UI_header, 
	UI_footer, 
	UI_h2,
	UI_singleHr
} from '../ui.js';

export default function testScript(runtime) {
	return new Promise(async function(resolve,reject) {

		console.log('Test script. Break stuff here.');

		let systems = await CAPI_fetch('systems');
		console.log('# Systems: ', systems.length);

		let bodies = await CAPI_fetch('bodies');
		console.log('# Bodies: ', bodies.length);

		let bmsites = await CAPI_fetch('bmsites');
		console.log('# BM Sites: ', bmsites.length);
		let bmtypes = await CAPI_fetch('bmtypes');
		console.log('# BM Types: ', bmtypes.length);

		let btsites = await CAPI_fetch('btsites');
		console.log('# BT Sites: ', btsites.length);
		let bttypes = await CAPI_fetch('bttypes');
		console.log('# BT Types: ', bttypes.length);

		let cssites = await CAPI_fetch('cssites');
		console.log('# CS Sites: ', cssites.length);
		let cstypes = await CAPI_fetch('cstypes');
		console.log('# CS Types: ', cstypes.length);

		let fgsites = await CAPI_fetch('fgsites');
		console.log('# FG Sites: ', fgsites.length);
		let fgtypes = await CAPI_fetch('fgtypes');
		console.log('# FG Types: ', fgtypes.length);

		let fmsites = await CAPI_fetch('fmsites');
		console.log('# FM Sites: ', fmsites.length);
		let fmtypes = await CAPI_fetch('fmtypes');
		console.log('# FM Types: ', fmtypes.length);

		let gvsites = await CAPI_fetch('gvsites');
		console.log('# GV Sites: ', gvsites.length);
		let gvtypes = await CAPI_fetch('gvtypes');
		console.log('# GV Types: ', gvtypes.length);

		let gysites = await CAPI_fetch('gysites');
		console.log('# GY Sites: ', gysites.length);
		let gytypes = await CAPI_fetch('gytypes');
		console.log('# GY Types: ', gytypes.length);

		let lssites = await CAPI_fetch('lssites');
		console.log('# LS Sites: ', lssites.length);
		let lstypes = await CAPI_fetch('lstypes');
		console.log('# LS Types: ', lstypes.length);

		let twsites = await CAPI_fetch('twsites');
		console.log('# TW Sites: ', twsites.length);
		let twtypes = await CAPI_fetch('twtypes');
		console.log('# TW Types: ', twtypes.length);

		

		resolve(true);
	})
}