import { EDSM_DELAY, EDSM_MAX_CALL_STACK } from './settings.js';
import { queryEDSMBodies, queryEDSMSystems } from './api/edsm.js';
import { updateBody, updateSystem } from './api/canonn.js';
import { chunkArray } from './functions.js';

/*
	Set up a queue for bodies or systems
	type: should either be "bodies" or "systems"
	updateArray: should be an array of objects (bodies/systems)
	fn: function to call on every queue tick
*/
export function queueUpdates(type, updateArray, fn) {

	var index = 0;
	var keyArray = {};
	var names = [];

	const updateErrors = [];

	if(type == 'systems') {

		console.log('============================================');
		console.log('UPDATING SYSTEMS');
		console.log('============================================');
		console.log('');

		// systems are passed in as blocks (arrays) of 
		// EDSM_MAX_CALL_STACK systems at one call.

		let chunks = chunkArray(updateArray);

		chunks.forEach( (systemsBlock, i) => {

			keyArray['CHUNK ['+i+']'] = systemsBlock;
			
			if( names.indexOf(i) == -1) {
				names.push('CHUNK ['+i+']');
			}
		});

	} else if( type == 'bodies' ) {

		console.log('============================================');
		console.log('UPDATING BODIES');
		console.log('============================================');
		console.log('');

		updateArray.forEach( body => {

			// we are looping over system names
			let name = body.system.systemName;

			// Then to each system name we're adding bodies that
			// are inside that system
			if( keyArray[name] ) {
				keyArray[name].push( body );
			} else {
				keyArray[name] = [body];
			}

			if( names.indexOf(name) == -1) {
				names.push(name);
			}
		});

	} else {
		console.log('[ERROR]: type argument should be either "systems" or "bodies"!');
		return null;
	}

	return new Promise(function(resolve, reject) {
		function next() {

			if(index < names.length) {

				let item = names[index++];
				let nextQ = keyArray[ item ];
	
				console.log('['+index+'/'+names.length+'] ~~ Updating '+item+': '+nextQ.length+' '+type);
	
				fn(item, nextQ, updateErrors).then( (r) => {

					console.log('');
					console.log('> Waiting '+EDSM_DELAY+'ms...');
	
					let AnthorsDelay = setTimeout(function() {
						console.log('');
						next();
					}, EDSM_DELAY);
	
				});
	
			} else {
				console.log('');
				console.log('[Ok...] UPDATE COMPLETE');
				console.log('');

				if(updateErrors.length > 0) {
					console.log('!!!!!!!!!!!!!!!! ERRORS !!!!!!!!!!!!!!!!!!!!');
					console.log('');
					updateErrors.forEach( error => {
						console.log(' - System: ', error.system);
						console.log(' - Body: ', error.body);
						console.log(' - Reason: ', error.msg);
						console.log('');
					});
					console.log('');
					console.log('!!!!!!!!!!!!!!!! ERRORS !!!!!!!!!!!!!!!!!!!!');
					console.log('');
				}

				resolve();
			}
			
		}
		next();
	});

}

export function updateBodies(systemName, bodies, errorsLog) {

	return new Promise(function(resolve, reject) {

		queryEDSMBodies(systemName).then( edsmBodies => {

			// promise array for all bodies updates
			var updateBodies = [];
			var edsmBodiesObj = {};

			edsmBodies.forEach( edsmBody => {
				let edmsBodyName = edsmBody.name.trim().toUpperCase();
				edsmBodiesObj[ edmsBodyName ] = edsmBody;
			});

			bodies.forEach( canonnBody => {

				let edsmBody = edsmBodiesObj[ canonnBody.bodyName.trim().toUpperCase() ];
		
				if( edsmBody ) {
		
					if(edsmBody.id) 							{ canonnBody.edsmID = edsmBody.id }
					if(edsmBody.bodyId) 						{ canonnBody.bodyID = edsmBody.bodyId }
					if(edsmBody.id64) 							{ canonnBody.id64 = edsmBody.id64 }
					if(edsmBody.type) 							{ canonnBody.type = edsmBody.type }
					if(edsmBody.subType) 						{ canonnBody.subType = edsmBody.subType }
					if(edsmBody.offset) 						{ canonnBody.offset = edsmBody.offset }
					if(edsmBody.distanceToArrival) 				{ canonnBody.distanceToArrival = edsmBody.distanceToArrival }
					if(edsmBody.isMainStar) 					{ canonnBody.isMainStar = edsmBody.isMainStar }
					if(edsmBody.isScoopable) 					{ canonnBody.isScoopable = edsmBody.isScoopable }
					if(edsmBody.isLandable) 					{ canonnBody.isLandable = edsmBody.isLandable }
					if(edsmBody.age) 							{ canonnBody.age = edsmBody.age }
					if(edsmBody.luminosity) 					{ canonnBody.luminosity = edsmBody.luminosity }
					if(edsmBody.absoluteMagnitude) 				{ canonnBody.absoluteMagnitude = edsmBody.absoluteMagnitude }
					if(edsmBody.solarMasses) 					{ canonnBody.solarMasses = edsmBody.solarMasses }
					if(edsmBody.solarRadius) 					{ canonnBody.solarRadius = edsmBody.solarRadius }
					if(edsmBody.gravity) 						{ canonnBody.gravity = edsmBody.gravity }
					if(edsmBody.earthMasses) 					{ canonnBody.earthMasses = edsmBody.earthMasses }
					if(edsmBody.radius) 						{ canonnBody.radius = edsmBody.radius }
					if(edsmBody.surfaceTemperature) 			{ canonnBody.surfaceTemperature = edsmBody.surfaceTemperature }
					if(edsmBody.surfacePressure) 				{ canonnBody.surfacePressure = edsmBody.surfacePressure }
					if(edsmBody.volcanismType) 					{ canonnBody.volcanismType = edsmBody.volcanismType }
					if(edsmBody.atmosphereType) 				{ canonnBody.atmosphereType = edsmBody.atmosphereType }
					if(edsmBody.terraformingState) 				{ canonnBody.terraformingState = edsmBody.terraformingState }
					if(edsmBody.orbitalPeriod) 					{ canonnBody.orbitalPeriod = edsmBody.orbitalPeriod }
					if(edsmBody.semiMajorAxis) 					{ canonnBody.semiMajorAxis = edsmBody.semiMajorAxis }
					if(edsmBody.orbitalEccentricity) 			{ canonnBody.orbitalEccentricity = edsmBody.orbitalEccentricity }
					if(edsmBody.orbitalInclination) 			{ canonnBody.orbitalInclination = edsmBody.orbitalInclination }
					if(edsmBody.argOfPeriapsis) 				{ canonnBody.argOfPeriapsis = edsmBody.argOfPeriapsis }
					if(edsmBody.rotationalPeriod) 				{ canonnBody.rotationalPeriod = edsmBody.rotationalPeriod }
					if(edsmBody.rotationalPeriodTidallyLocked) 	{ canonnBody.rotationalPeriodTidallyLocked = edsmBody.rotationalPeriodTidallyLocked }
					if(edsmBody.axialTilt) 						{ canonnBody.axialTilt = edsmBody.axialTilt }
		
					if(edsmBody.solidComposition) 				{ canonnBody.solidComposition = edsmBody.solidComposition }
					if(edsmBody.atmosphere) 					{ canonnBody.atmosphere = edsmBody.atmosphere }
					if(edsmBody.materials) 						{ canonnBody.material = edsmBody.materials }

					updateBodies.push( updateBody(canonnBody) );

				} else {

					// Error reporting

					canonnBody.scriptCheck = {
						system: canonnBody.system.systemName,
						body: canonnBody.bodyName,
						edsmBody: 'Not found.',
						error: true,
						msg: 'Body not found in EDSM.'
					}

					// This is for checking if Canonn "A 2 b" is EDSM "2 b" type.
					let correctedCanonnBody = canonnBody.bodyName.replace( canonnBody.system.systemName, '' )
						correctedCanonnBody = correctedCanonnBody.trim().substr(1).trim();
						correctedCanonnBody = canonnBody.system.systemName.toUpperCase()+' '+correctedCanonnBody;

					let edsmErrorBody = edsmBodiesObj[correctedCanonnBody];

					if( edsmErrorBody ) {
						console.log(' < [ERROR] Canonn API body designation incorrect.');
						console.log(' < [ERROR] EDSM body: ['+edsmErrorBody.name+']');
						console.log(' < [ERROR] Canonn body: ['+canonnBody.bodyName+']');
						canonnBody.scriptCheck.msg = 'Canonn API body designation incorrect. EDSM body: ['+edsmErrorBody.name+']; Canonn body: ['+canonnBody.bodyName+']';
						canonnBody.scriptCheck.edsmBody = edsmErrorBody;

					} else {
						console.log(' < [CANONN, EDSM] Body not found: ', canonnBody.bodyName);
					}					

				}
		
			});

			return Promise.all(updateBodies).then( r => {

				bodies.forEach( body => {

					if( body.scriptCheck && body.scriptCheck.error == true ) {

						errorsLog.push({
							system: body.scriptCheck.system,
							body: body.scriptCheck.body,
							msg: body.scriptCheck.msg
						});

					}
				});

				resolve();

			});
	
		//queryEDSMBodies end
		});

	});

}


export function updateSystems(index, systemsChunk, errorsLog) {

	return new Promise(function(resolve, reject) {

		var edsmSystemNames = [];

		systemsChunk.forEach( system => {
			edsmSystemNames.push( system.systemName.toUpperCase() );
		});

		queryEDSMSystems(edsmSystemNames).then( edsmSystems => {

			var updateSystems = [];
			var edsmSystemsObj = {};

			edsmSystems.forEach( edsmSystem => {
				let edmsSystemName = edsmSystem.name.trim().toUpperCase();
				edsmSystemsObj[ edmsSystemName ] = edsmSystem;
			});

			systemsChunk.forEach( canonnSystem => {

				let edsmSystem = edsmSystemsObj[ canonnSystem.systemName.trim().toUpperCase() ];

				console.log('DEV: edsmSystem', edsmSystem);

				if(edsmSystem) {

					if(edsmSystem.id)			{ canonnSystem.edsmID = edsmSystem.id }
					if(edsmSystem.id64) 		{ canonnSystem.id64 = edsmSystem.id64 }
					if(edsmSystem.coords) 		{ 
													canonnSystem.edsmCoordX = edsmSystem.coords.x; 
					 								canonnSystem.edsmCoordY = edsmSystem.coords.y;
					 								canonnSystem.edsmCoordZ = edsmSystem.coords.z;
												}

					if(edsmSystem.coordsLocked) { canonnSystem.edsmCoordLocked = edsmSystem.coordsLocked }

					updateSystems.push( updateSystem(canonnSystem) );
				}

			});

			return Promise.all(updateSystems).then( r => {
				resolve();
			});

		});

	});

}