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
  constructor() {
    super();

    this.bindCollectionClass(AppRuntimeCollection);

    this.setTitle("AppRuntime Orchestration Service");
  }

  // TODO: Build out
  startAppRuntime(appDescriptor) {
    const appRuntime = new AppRuntime(appDescriptor);

    this.getCollectionInstance(AppRuntimeCollection).addAppRuntime(appRuntime);

    return appRuntime;
  }

  // TODO: Build out
  closeAppRuntime(appDescriptor) {
    // TODO: Get app runtime w/ descriptor
    // Destruct app runtime

    throw new ReferenceError("TODO: Build out closeAppRuntime");
  }

  // TODO: Document
  getAppRuntimes() {
    return this.getCollectionInstance(AppRuntimeCollection).getAppRuntimes();
  }
}
