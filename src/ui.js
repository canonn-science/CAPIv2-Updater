// This file contains all the UI parts of the updater.
// Please use these functions to keep consistent display across all scripts.

export function UI_header(text) {
	console.log('========================================================');
	console.log(text);
	console.log('--------------------------------------------------------');
	console.log();
}

export function UI_footer(text) {
	console.log('--------------------------------------------------------');
	console.log(text);
	console.log('========================================================');
	console.log();
}

export function UI_h2(text) {
	console.log();
	console.log(text);
	console.log('----------------------------------------------');
}

export function UI_singleHr() {
	console.log('----------------------------------------------');
}

export function UI_doubleHr() {
	console.log('==============================================');
}