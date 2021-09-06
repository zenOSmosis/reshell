import {
  PhantomCollection,
  EVT_CHILD_INSTANCE_ADDED,
  EVT_CHILD_INSTANCE_REMOVED,
  EVT_UPDATED,
  EVT_DESTROYED,
} from "phantom-core";

import AppRuntime from "./AppRuntime";

export {
  EVT_CHILD_INSTANCE_ADDED,
  EVT_CHILD_INSTANCE_REMOVED,
  EVT_UPDATED,
  EVT_DESTROYED,
};

// TODO: Document
export default class AppRuntimeCollection extends PhantomCollection {
  addChild(appRuntime) {
    if (!(appRuntime instanceof AppRuntime)) {
      throw new TypeError("appRuntime is not an AppRuntime");
    }

    return super.addChild(appRuntime);
  }

  /**
   * @param {AppRuntime} appRuntime
   * @return {void}
   */
  addAppRuntime(appRuntime) {
    return this.addChild(appRuntime);
  }

  /**
   *
   * @param {AppRuntime} appRuntime
   * @return {void}
   */
  removeAppRuntime(appRuntime) {
    return this.removeChild(appRuntime);
  }

  /**
   * @return {AppRuntime[]}
   */
  getAppRuntimes() {
    return this.getChildren();
  }
}
