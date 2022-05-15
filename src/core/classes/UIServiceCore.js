import { PhantomServiceCore } from "phantom-core";
const { EVT_UPDATED, EVT_DESTROYED } = PhantomServiceCore;

export { EVT_UPDATED, EVT_DESTROYED };

/**
 * PhantomServiceCore extension which is meant to operate in a browser or
 * Electron process.
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

  /**
   * Binds an event handler to the browser's window object.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
   *
   * @param {event} eventName
   * @param {Function} eventHandler
   * @param {Object | boolean} eventOptions? [default = {}]
   */
  addNativeEventListener(eventName, eventHandler, eventOptions = {}) {
    window.addEventListener(eventName, eventHandler, eventOptions);

    this.registerCleanupHandler(() =>
      window.removeEventListener(eventName, eventHandler, eventOptions)
    );

    return {
      eventName,
      eventHandler,
      eventOptions,
    };
  }

  /**
   * Note: While addEventListener() will let you add the same listener more
   * than once for the same type if the options are different, the only
   * option removeEventListener() checks is the capture/useCapture flag. Its
   * value must match for removeEventListener() to match, but the other values
   * don't.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener
   *
   * @param {event} eventName
   * @param {Function} eventHandler
   * @param {Object | boolean} eventOptions? [default = {}]
   */
  removeNativeEventListener(eventName, eventHandler, eventOptions = {}) {
    window.removeEventListener(eventName, eventHandler, eventOptions);
  }
}
