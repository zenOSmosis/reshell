import { PhantomCollection, EVT_UPDATE, EVT_DESTROY } from "phantom-core";

import AppRuntime from "./AppRuntime";

export { EVT_UPDATE, EVT_DESTROY };

// TODO: Document
export default class AppRuntimeCollection extends PhantomCollection {
  // TODO: Document
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
