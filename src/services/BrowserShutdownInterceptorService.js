import UIServiceCore from "@core/classes/UIServiceCore";

/**
 * Provides basic shutdown handling interception.
 */
export default class BrowserShutdownInterceptorService extends UIServiceCore {
  constructor(...args) {
    super(...args);

    this.setTitle("Browser Shutdown Interceptor Service");

    window.onbeforeunload = evt => {
      evt.preventDefault();

      return false;
    };

    this.registerCleanupHandler(() => {
      window.onbeforeunload = null;
    });
  }
}
