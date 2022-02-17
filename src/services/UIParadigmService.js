import UIServiceCore, { EVT_UPDATED } from "@core/classes/UIServiceCore";

import ScreenService from "./ScreenService";

export { EVT_UPDATED };

const DESKTOP_MINIMUM_WIDTH = 640;
const DESKTOP_MINIMUM_HEIGHT = 480;

export const DESKTOP_PARADIGM = "desktop";
export const MOBILE_PARADIGM = "mobile";

/**
 * UI service class for desktop paradigm detection.
 */
export default class UIParadigmService extends UIServiceCore {
  constructor(...args) {
    super(...args);

    this.setTitle("Paradigm Switching Service");

    this._screenService = this.useServiceClass(ScreenService);

    this.setState({
      paradigm: null,
    });

    // Monitor paradigm changes
    (() => {
      const _handleParadigmAutoDetect = () => this._detectParadigm();

      this.proxyOn(this._screenService, EVT_UPDATED, () =>
        _handleParadigmAutoDetect()
      );

      // Perform initial auto-detection
      _handleParadigmAutoDetect();
    })();
  }

  /**
   * Retrieves the paradigm of the ReShell environment.
   *
   * @return {DESKTOP_PARADIGM | MOBILE_PARADIGM}
   */
  getParadigm() {
    return this.getState().paradigm;
  }

  /**
   * Detects the current desktop paradigm and sets it as state.
   *
   * @return {void}
   */
  _detectParadigm() {
    const { screenWidth, screenHeight } = this._screenService.getState();

    let paradigm = null;

    if (
      screenWidth < DESKTOP_MINIMUM_WIDTH ||
      screenHeight < DESKTOP_MINIMUM_HEIGHT
    ) {
      paradigm = MOBILE_PARADIGM;
    } else {
      paradigm = DESKTOP_PARADIGM;
    }

    this.setState({
      paradigm,
    });
  }
}
