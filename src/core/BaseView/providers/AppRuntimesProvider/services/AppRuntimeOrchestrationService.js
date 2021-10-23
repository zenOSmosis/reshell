import UIServiceCore, {
  EVT_UPDATED,
  EVT_DESTROYED,
} from "@core/classes/UIServiceCore";

import AppRuntime from "../classes/AppRuntime";
import AppRuntimeCollection from "../classes/AppRuntimeCollection";

export { EVT_UPDATED, EVT_DESTROYED };

/**
 * Manages the starting, stopping, and collection of AppRuntimes.
 */
export default class AppRuntimeOrchestrationService extends UIServiceCore {
  // TODO: Document
  constructor({ ...args }) {
    super({ ...args });

    this.setTitle("AppRuntime Orchestration Service");

    this.bindCollectionClass(AppRuntimeCollection);
  }

  // TODO: Document
  startAppRuntime(appDescriptor) {
    const appRuntime = new AppRuntime(appDescriptor);

    this.getCollectionInstance(AppRuntimeCollection).addAppRuntime(appRuntime);

    return appRuntime;
  }

  // TODO: Document
  // Helper method; does not have to be called directly on this service if
  // destructing the instance directly
  async closeAppRuntime(appRuntime) {
    return appRuntime.destroy();
  }

  // TODO: Document
  getAppRuntimes() {
    return this.getCollectionInstance(AppRuntimeCollection).getAppRuntimes();
  }
}
