/*
	This is a script used for testing purpuses only
*/

import { CAPI_update } from '../api/api';

export default function testScript(runtime) {
	return new Promise(async function(resolve,reject) {

		console.log('Test script. Break stuff here.');

		let t = await CAPI_update('btreports', {
			id: 52,
			latitude: -23.3821
		});

		console.log(t);

		resolve(true);
	})
}