import UIServiceCore from "@core/classes/UIServiceCore";

import "./spies/WebSocket.spy";

export default class NativeSpyService extends UIServiceCore {
  constructor(...args) {
    super(...args);

    this.setTitle("Native Spy Service");

    // TODO: Include ability to monitor services
  }
}
