import UIServiceCore, { EVT_UPDATED } from "@core/classes/UIServiceCore";
import persistentSpyAgentCollection from "./persistentSpyAgentCollection";

// Register spies
import "./spies/WebSocket.spy";

import { nativeSpies } from "./registerSpyAgent";

/**
 * IMPORTANT: For best results this service should be started up while ReShell
 * is "booting".
 */
export default class NativeSpyService extends UIServiceCore {
  /**
   * My spy service...
   */
  constructor(...args) {
    super(...args);

    this.setTitle("Native JavaScript Spy Service");

    this.setState({ spyAgents: [] });

    this._persistentSpyAgentCollection = persistentSpyAgentCollection;

    this.proxyOn(this._persistentSpyAgentCollection, EVT_UPDATED, () => {
      // TODO: Debounce (this could render a lot depending on how the spy is
      // set up, esp. w/ WebSocket connections)

      const spyAgents = this._persistentSpyAgentCollection.getChildren();

      // TODO: Remove
      console.log({ spyAgents });

      // TODO: Handle
      // this.setState({ spyAgents: spyAgents.map(agent => agent.getState()) });
    });
  }

  getRegisteredSpyAgents() {
    return nativeSpies;
  }
}
