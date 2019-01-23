/*
	These are all the CAPI update methods to be used with CAPI_update(type, data) function.
*/

import CAPI_GET from './capi_get';

import { API_CANONN_REST } from '../../settings';

import system_from_edsm from '../../updaters/system_from_edsm';
import body_from_edsm from '../../updaters/body_from_edsm';
import btreportUpdater from '../../updaters/btreportUpdater';

const CAPI_UPDATE = {

	/*'apiupdates': {
		url: API_CANONN_REST+'/apiupdates',
		updater:  apiupdatesUpdater,
		getter: CAPI_GET['apiupdates']
	},*/

	'systems': {
		url: API_CANONN_REST+'/systems',
		updater:  system_from_edsm,
		getter: CAPI_GET['systems']
	},

	'bodies': {
		url: API_CANONN_REST+'/bodies',
		updater:  body_from_edsm,
		getter: CAPI_GET['bodies']
	},

	'btreports': {
		url: API_CANONN_REST+'/btreports',
		updater:  btreportUpdater,
		getter: CAPI_GET['btreports']
	},

	/*
	'btsites': {
		url: API_CANONN_REST+'/btsites',
		updater:  btsitesUpdater,
		getter: CAPI_GET['btsites']
	}*/

};

export default CAPI_UPDATE;