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
    // FIXME: (jh) The only way I could get this to sort alphabetically on
    // Firefox was to build a reverse-sorted list, then reverse it again;
    // Chrome was not affected by this
    return this.getChildren()
      .sort((a, b) => {
        const aTitle = a.getTitle();
        const bTitle = b.getTitle();

        if (aTitle < bTitle) {
          return 1;
        } else if (bTitle > aTitle) {
          return -1;
        } else {
          return 0;
        }
      })
      .reverse();
  }
}
