import { EDSM_DELAY, EDSM_MAX_CALL_STACK } from './settings.js';
import { queryEDSMBodies, queryEDSMSystems } from './api/edsm.js';
import { updateBody, updateSystem } from './api/canonn.js';

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

	if(type == 'systems') {

		console.log('--- UPDATING SYSTEMS --- ');
		console.log('');

		// systems are passed in as blocks (arrays) of 
		// EDSM_MAX_CALL_STACK systems at one call.

		updateArray.forEach( (systemsBlock, i) => {
			keyArray[i] = systemsBlock;
			names.push(i);
		});

	} else if( type == 'bodies' ) {

		console.log('--- UPDATING BODIES --- ');
		console.log('');

		updateArray.forEach( body => {

			// we are looping over system names
			let name = body.system.systemName;

			// Then to each system name we're adding bodies that
			// are inside that system
			if( keyArray[name] ) {
				keyArray[name].push( body )
			} else {
				keyArray[name] = [body];
			}

			names.push(name);
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
	
				console.log('['+index+'] ~~ Updating ['+item+']: '+nextQ.length+' '+type);
	
				fn(item, nextQ).then( (r) => {

					console.log('> Waiting '+EDSM_DELAY+'ms...');
	
					let AnthorsDelay = setTimeout(function() {
						console.log('');
						next();
					}, EDSM_DELAY);
	
				});
	
			} else {
				console.log('');
				console.log('------ UPDATE COMPLETE ------');
				console.log('');
				resolve();
			}
			
		}
		next();
	});

}

export function updateBodies(systemName, bodies) {

	return new Promise(function(resolve, reject) {

		queryEDSMBodies(systemName).then( edsmBodies => {

			edsmBodies.forEach( edsmBody => {
	
				bodies.forEach( canonnBody => {
		
					if( canonnBody.bodyName.toUpperCase() == edsmBody.name.toUpperCase() ) {
		
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
		
						//if(edsmBody.solidComposition) 				{ canonnBody.solidComposition = edsmBody.solidComposition }
						//if(edsmBody.atmosphere) 					{ canonnBody.atmosphere = edsmBody.atmosphere }
						//if(edsmBody.materials) 						{ canonnBody.material = edsmBody.materials }
		
						updateBody(canonnBody);

					}
		
				});
			});
	
		resolve();
		//queryEDSMBodies end
		});

	});

	

}