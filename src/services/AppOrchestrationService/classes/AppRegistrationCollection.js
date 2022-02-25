import { PhantomCollection, EVT_UPDATED, EVT_DESTROYED } from "phantom-core";

import AppRegistration from "./AppRegistration";

export { EVT_UPDATED, EVT_DESTROYED };

// TODO: Document
export default class AppRegistrationCollection extends PhantomCollection {
  // TODO: Document
  addChild(appRegistration) {
    if (!(appRegistration instanceof AppRegistration)) {
      throw new TypeError("appRegistration is not an AppRegistration");
    }

    return super.addChild(appRegistration);
  }

  /**
   * @param {AppRegistration} appRegistration
   * @return {void}
   */
  addAppRegistration(appRegistration) {
    return this.addChild(appRegistration);
  }

  /**
   *
   * @param {AppRegistration} appRegistration
   * @return {void}
   */
  removeAppRegistration(appRegistration) {
    return this.removeChild(appRegistration);
  }

  /**
   * @return {AppRegistration[]}
   */
  getAppRegistrations() {
    // IMPORTANT: Don't sort these here unless the result can be memoized
    return this.getChildren();
  }
}
