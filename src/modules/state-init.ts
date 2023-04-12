import {firestoreApi} from './firestore-api';

export function initState() {
  firestoreApi.getFlavorVendors()
      .then((vendors) => {
        for (const vendor of vendors) {
          console.log(vendor);
        }
      })
      .catch((error: Error) => {
        console.error(error);
      });

  firestoreApi.getFlavors()
      .then((flavors) => {
        for (const flavor of flavors) {
          console.log(flavor);
        }
      })
      .catch((error: Error) => {
        console.error(error);
      });
}
