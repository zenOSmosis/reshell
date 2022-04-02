import UIServiceCore, { EVT_UPDATED } from "@core/classes/UIServiceCore";
import persistentSpyAgentCollection from "./persistentSpyAgentCollection";
import { spyAgents } from "./registerSpyAgent";

import "./spies/WebSocket.spy";

/**
 * IMPORTANT: For best results this service should be started up while ReShell
 * is "booting".
 */
export default class NativeSpyService extends UIServiceCore {
  constructor(...args) {
    super(...args);

    this.setTitle("Native JavaScript Spy Service");

    this.setState({ spyAgents: [] });

    this._persistentSpyAgentCollection = persistentSpyAgentCollection;

    this.proxyOn(this._persistentSpyAgentCollection, EVT_UPDATED, () => {
      const spyAgents = this._persistentSpyAgentCollection.getChildren();

      this.setState({ spyAgents: spyAgents.map(agent => agent.getState()) });
    });
  }

  getRegisteredSpyAgents() {
    return spyAgents;
  }
}
