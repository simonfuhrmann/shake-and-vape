import {ReactiveController, ReactiveControllerHost} from 'lit';
import {State, stateManager} from '../modules/state-types';
import {StateListener} from '../modules/state-manager';

/**
 * Hosts need to implement the stateChanged callback.
 */
export interface StateControllerHost extends ReactiveControllerHost {
  stateChanged: StateListener<State>;
}

/**
 * Controller to interface with the global state management system. It connects
 * and disconnects the state change callbacks based on the hosts life cycle.
 */
export class StateController implements ReactiveController {
  private host: StateControllerHost;
  private stateChanged: StateListener<State>;

  constructor(host: StateControllerHost) {
    this.host = host;
    this.stateChanged = host.stateChanged.bind(host);
    this.host.addController(this);
  }

  getState(): State {
    return stateManager.getState();
  }

  hostConnected() {
    stateManager.addListener(this.stateChanged);
  }

  hostDisconnected() {
    stateManager.removeListener(this.stateChanged);
  }
}

// For convenience.
export {State};
