/*
	This is a script used for testing purpuses only
*/

import Update from '../UpdateManager';

import { CAPI_fetch, CAPI_update, EDSM_fetch, API_fetch } from '../api/api';

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


		resolve(true);
	})
}