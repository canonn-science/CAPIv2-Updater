import { queryEDSMBodies } from '../api/edsm';
import { updateBody } from '../api/canonn';

/*
	Bodies update logic.
*/

export default function updateBodies(systemName, bodies, errorsLog) {

	return new Promise(function(resolve, reject) {

		queryEDSMBodies(systemName).then( edsmBodies => {

			// promise array for all bodies updates
			const updateBodies = [];
			const edsmBodiesObj = {};

			edsmBodies.forEach( edsmBody => {
				let edmsBodyName = edsmBody.name.trim().toUpperCase();
				edsmBodiesObj[ edmsBodyName ] = edsmBody;
			});

			bodies && bodies.forEach( canonnBody => {

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