import {firestoreApi} from './firestore-api';

import * as actions from './state-actions';

/**
 * Initializes the global state by fetching the list of vendors and flavors
 * from Firebase. Build flavor map once both flavors and vendors are available.
 */
export function initState() {
  firestoreApi.getVendors()
      .then(actions.setVendors)
      .catch((error: Error) => { console.error(error); });

  firestoreApi.getFlavors()
      .then(actions.setFlavors)
      .catch((error: Error) => { console.error(error); });
}
