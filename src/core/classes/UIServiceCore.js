import { PhantomServiceCore } from "phantom-core";
const { EVT_UPDATED, EVT_DESTROYED } = PhantomServiceCore;

export { EVT_UPDATED, EVT_DESTROYED };

/**
 * TODO: Add main caption line
 *
 * ReShell uses services extended by UIServiceCore to share state across
 * applications which use the same services. Windows which are bound to a
 * particular service are automatically re-rendered whenever EVT_UPDATED is
 * emit from the service.
 */
export default class UIServiceCore extends PhantomServiceCore {
  constructor(...args) {
    if (window === undefined) {
      throw new Error(
        "UIServiceCore can only be run on the main thread in a browser window"
      );
    }

    super(...args);
  }
}
