// That's all the data fetching and data updating you should ever need.
import { CAPI_fetch, CAPI_update, EDSM_fetch } from "../api/api";

import invalidBody from "../validators/body";

// Import UI console printers for consistent script look
import { UI_h2 } from "../ui";

export default function bodiesScript(runtime) {
  return new Promise(async function(resolve, reject) {
    let update;
    let payload = [];

    UI_h2("Fetching Bodies from CAPI");
    let capi_bodies = await CAPI_fetch("bodies");
    let candidates = capi_bodies.filter(invalidBody);

    console.log("Total:", capi_bodies.length);
    console.log("Candidates:", candidates.length);

    // Runtime parameters modifiers for this script
    if (runtime.ids) {
      update = runtime.ids.map(id => {
        let body = capi_bodies.find(bdy => {
          return bdy.id == id;
        });

        if (body) {
          return body;
        }
      });
    } else if (runtime.force) {
      update = capi_bodies;
    } else {
      update = candidates;
    }

    UI_h2("Finding systems to ask EDSM about " + update.length + " bodies.");

    const querySystems = [];

    update.forEach(body => {
      if (querySystems.indexOf(body.system.systemName) === -1) {
        querySystems.push(body.system.systemName);
      }
    });

    console.log("Query EDSM for " + querySystems.length + " full system info:");

    let counter = 1;
    for (let systemName of querySystems) {
      UI_h2(
        "Fetching bodies info from EDSM [" +
          counter +
          "/" +
          querySystems.length +
          "]: " +
          systemName.toUpperCase()
      );

      let edsm_response = await EDSM_fetch("bodies", {
        systemName: systemName
      });

      function isEmpty(obj) {
        for (var key in obj) {
          if (obj.hasOwnProperty(key)) return false;
        }
        return true;
      }

      if (edsm_response && isEmpty(edsm_response[0]) == false) {
        let bodies = edsm_response[0].bodies;
        for (let body of bodies) {
          let capiBody = update.find(capibody => {
            return capibody.bodyName.toLowerCase() == body.name.toLowerCase();
          });

          if (capiBody) {
            console.log(
              "<- Updating [" +
                capiBody.bodyName.toUpperCase() +
                "] body in CAPI"
            );
            await CAPI_update("bodies", { capibody: capiBody, edsmbody: body });
          }
        }
      } else {
        console.log("-> [EDSM] Could not find system.");
      }

      counter++;
    }

    await CAPI_update("bodies", payload);

    resolve(true);
  });
}
