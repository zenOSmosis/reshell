import UIServiceCore, {
  EVT_UPDATED,
  EVT_DESTROYED,
} from "@core/classes/UIServiceCore";

import AppRuntime from "../classes/AppRuntime";
import AppRuntimeCollection from "../classes/AppRuntimeCollection";

export { EVT_UPDATED, EVT_DESTROYED };

// TODO: Build out
export default class AppRuntimeOrchestrationService extends UIServiceCore {
  constructor(...args) {
    super(...args);

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

    alert("TODO: Build out");
  }

  // TODO: Document
  getAppRuntimes() {
    return this.getCollectionInstance(AppRuntimeCollection).getAppRuntimes();
  }
}
