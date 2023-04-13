import {User as FirebaseUser} from 'firebase/auth';

import {Flavor, Vendor, State, UserDetails, stateManager, getInitialState} from './state-types';

function assignVendorsToFlavors(
    vendors: Map<string, Vendor>, flavors: Map<string, Flavor>) {
  flavors.forEach((flavor) => {
    flavor.vendor = vendors.get(flavor.vendorId);
  });
}

/**
 * Resets the global state.
 */
export function resetState() {
  const action = (): State => getInitialState();
  stateManager.processAction(action);
}

/**
 * Sets the currently authenticated Firebase user.
 */
export function setCurrentUser(firebaseUser: FirebaseUser|null) {
  const action = (state: State): State => {
    if (state.firebaseUser === firebaseUser) return state;
    return {...state, firebaseUser};
  };
  stateManager.processAction(action);
}

/**
 * Sets the user details of the currently authenticated Firebase user.
 */
export function setUserDetails(userDetails: UserDetails|null) {
  const action = (state: State): State => {
    if (state.userDetails === userDetails) return state;
    return {...state, userDetails};
  };
  stateManager.processAction(action);
}

/**
 * Sets the flavor vendor list.
 */
export function setVendors(vendorList: Vendor[]) {
  const action = (state: State): State => {
    const map = new Map();
    vendorList.forEach((vendor) => map.set(vendor.id, vendor));
    assignVendorsToFlavors(map, state.flavors);
    return {...state, vendors: map};
  };
  stateManager.processAction(action);
}

/**
 * Sets the flavor list.
 */
export function setFlavors(flavorList: Flavor[]) {
  const action = (state: State): State => {
    const map = new Map();
    flavorList.forEach((flavor) => map.set(flavor.id, flavor));
    assignVendorsToFlavors(state.vendors, map);
    return {...state, flavors: map};
  };
  stateManager.processAction(action);
}
