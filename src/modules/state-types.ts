import {User as FirebaseUser} from 'firebase/auth';

import {StateManager} from './state-manager';

export interface UserDetails {
  name: string;
}

export interface FlavorVendor {
  id: string;       // Example: 'cap'
  name: string;     // Example: 'Capella'
  short: string;    // Example: 'CAP'
  website: string;  // Example: 'http://www.capellaflavors.com'
  description: string;
}

export interface Flavor {
  id: string;        // Example: 'cap-apple-pie'
  name: string;      // Example: 'Apple Pie'
  vendor: FlavorVendor;
}

export interface State {
  firebaseUser: FirebaseUser|null;
  userDetails: UserDetails|null;
  flavorVendors: FlavorVendor[]|null;
  flavors: Flavor[]|null;
}

export function getInitialState(): State {
  return {
    firebaseUser: null,
    userDetails: null,
    flavorVendors: null,
    flavors: null,
  };
}

export const stateManager = new StateManager(getInitialState());
