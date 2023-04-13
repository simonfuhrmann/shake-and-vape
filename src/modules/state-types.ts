import {User as FirebaseUser} from 'firebase/auth';

import {StateManager} from './state-manager';

export interface UserDetails {
  name: string;
}

export interface Vendor {
  id: string;       // Example: 'cap'
  name: string;     // Example: 'Capella'
  short: string;    // Example: 'CAP'
  website: string;  // Example: 'http://www.capellaflavors.com'
  description: string;
}

export interface Flavor {
  id: string;        // Example: 'cap-apple-pie'
  name: string;      // Example: 'Apple Pie'
  vendorId: string   // Example: 'cap'
  vendor: Vendor|undefined;
}

export interface State {
  firebaseUser: FirebaseUser|null;
  userDetails: UserDetails|null;
  vendors: Map<string, Vendor>;
  flavors: Map<string, Flavor>;
}

export function getInitialState(): State {
  return {
    firebaseUser: null,
    userDetails: null,
    vendors: new Map(),
    flavors: new Map(),
  };
}

export const stateManager = new StateManager(getInitialState());
