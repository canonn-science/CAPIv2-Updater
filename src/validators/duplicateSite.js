/*
	Validates if a site report is close enough to an existing site to be classified as duplicate
*/

import Update from '../UpdateManager';

// Distance in kilometers below which a site is considered a duplicate.
const MIN_DISTANCE = 5;

export default function validateDuplicateSite(sitesToCheck = [], body = null, {latitude = null, longitude = null}) {

	let duplicates = [];

	if( latitude && longitude ) {

		sitesToCheck.forEach( site => {

			if( body && body.radius ) {

				let distance = harvesine({
						latitude: site.latitude,
						longitude: site.longitude
					}, {
						latitude: latitude,
						longitude: longitude
					}, body.radius);

				console.log( '   Existing site ID: '+site.id+' distance to reported site ~ '+distance.toFixed(2)+' km.' );


				if( distance <= MIN_DISTANCE ) {
					console.log( '   Existing site ID: '+site.id+' found in distance of ~ '+distance.toFixed(2)+' km. Marked as duplicate.' );
					duplicates.push(site);
				}

			} else {
				console.log();
				console.log('NO BODY RADIUS IN CAPI');
	
				duplicates = null;
	
			}

		});
		

	}

	// return object state
	return duplicates;
	
}

// thanks to Sileo

// Returns distance between two points on a sphere with r = radius in kilometers

function harvesine(p1, p2, radius) {

	if( p1.latitude && p1.longitude && p2.latitude && p2.longitude && radius ) {

		const phi_a = p1.latitude * Math.PI / 180.;
    	const lambda_a = p1.longitude * Math.PI / 180.;
    	
    	const phi_b = p2.latitude * Math.PI / 180.;
    	const lambda_b = p2.longitude * Math.PI / 180.;
    	
    	const radius_planet = radius;

    	let d_lambda;
		let S_ab;
		let D_ab;
    	
    	if(phi_a!=phi_b || lambda_b!=lambda_a) {
    	    d_lambda = lambda_b - lambda_a;
    	    S_ab = Math.acos(Math.sin(phi_a)*Math.sin(phi_b)+Math.cos(phi_a)*Math.cos(phi_b)*Math.cos(d_lambda));
    	    D_ab = S_ab * radius_planet;
    	} else {
    	    D_ab = 0;
    	}
    	
    	return D_ab;


	} else {
		Update.log({
			type: 'error',
			msg: 'HARVESINE: missing data: p1{latitude: '+p1.latitude+', longitude'+p1.longitude+'}, p2{latitude: '+p2.latitude+', longitude'+p2.longitude+'}, radius:'+radius
		});

		return null;
	}


}