/*
	These are all the CAPI update methods to be used with CAPI_update(type, data) function.
*/

import CAPI_GET from './capi_get';

import { API_CANONN_REST } from '../../settings';

import system_from_edsm from '../../updaters/system_from_edsm';
import body_from_edsm from '../../updaters/body_from_edsm';
import reportUpdater from '../../updaters/report';
import siteUpdater from '../../updaters/site';
import site_from_report from '../../updaters/site_from_report';

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

	'bmreports': {
		url: API_CANONN_REST+'/bmreports',
		updater:  reportUpdater,
		getter: CAPI_GET['bmreports']
	},

	'btreports': {
		url: API_CANONN_REST+'/btreports',
		updater:  reportUpdater,
		getter: CAPI_GET['btreports']
	},

	'csreports': {
		url: API_CANONN_REST+'/csreports',
		updater:  reportUpdater,
		getter: CAPI_GET['csreports']
	},

	'fgreports': {
		url: API_CANONN_REST+'/fgreports',
		updater:  reportUpdater,
		getter: CAPI_GET['fgreports']
	},

	'fmreports': {
		url: API_CANONN_REST+'/fmreports',
		updater:  reportUpdater,
		getter: CAPI_GET['fmreports']
	},

	'gvreports': {
		url: API_CANONN_REST+'/gvreports',
		updater:  reportUpdater,
		getter: CAPI_GET['gvreports']
	},

	'gyreports': {
		url: API_CANONN_REST+'/gyreports',
		updater:  reportUpdater,
		getter: CAPI_GET['gyreports']
	},

	'lsreports': {
		url: API_CANONN_REST+'/lsreports',
		updater:  reportUpdater,
		getter: CAPI_GET['lsreports']
	},

	'twreports': {
		url: API_CANONN_REST+'/twreports',
		updater:  reportUpdater,
		getter: CAPI_GET['twreports']
	}

};

export default CAPI_UPDATE;