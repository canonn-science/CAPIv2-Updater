import { queryEDSMSystems } from '../api/edsm';
import { updateSystem } from '../api/canonn';

/*
	Systems update logic.
*/

export default function updateSystems(index, systemsChunk, errorsLog) {

	return new Promise(function(resolve, reject) {

		const edsmSystemNames = [];
		const updateSystems = [];
		const edsmSystemsObj = {};

		systemsChunk.forEach( system => {
			edsmSystemNames.push( system.systemName.toUpperCase() );
		});

		queryEDSMSystems(edsmSystemNames).then( edsmSystems => {

			edsmSystems.forEach( edsmSystem => {
				let edmsSystemName = edsmSystem.name.trim().toUpperCase();
				edsmSystemsObj[ edmsSystemName ] = edsmSystem;
			});

			systemsChunk.forEach( canonnSystem => {

				let edsmSystem = edsmSystemsObj[ canonnSystem.systemName.trim().toUpperCase() ];

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