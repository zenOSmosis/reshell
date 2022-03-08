import UIServiceCore, { EVT_UPDATED } from "@core/classes/UIServiceCore";

import ScreenService from "./ScreenService";

export { EVT_UPDATED };

const DESKTOP_MINIMUM_WIDTH = 640;
const DESKTOP_MINIMUM_HEIGHT = 480;

export const DESKTOP_PARADIGM = "desktop";
export const MOBILE_PARADIGM = "mobile";
export const AUTO_DETECT_PARADIGM = null;

/**
 * UI service class for desktop paradigm detection.
 */
export default class UIParadigmService extends UIServiceCore {
  constructor(...args) {
    super(...args);

    this.setTitle("UI Paradigm Service");

    this._screenService = this.useServiceClass(ScreenService);

    // TODO: Retain preferred setting across page loads
    this.setState({
      uiParadigm: AUTO_DETECT_PARADIGM,
      isAutoSet: true,
    });

    // Monitor paradigm changes
    (() => {
      const _handleUIParadigmAutoDetect = () => {
        // Skip if not auto set
        if (!this.getState().isAutoSet) {
          return;
        }

        this.setState({
          uiParadigm: this._detectUIParadigm(),
        });
      };

      this.proxyOn(this._screenService, EVT_UPDATED, () =>
        _handleUIParadigmAutoDetect()
      );

      // Perform initial auto-detection
      _handleUIParadigmAutoDetect();
    })();
  }

  /**
   * @param {DESKTOP_PARADIGM | MOBILE_PARADIGM | AUTO_DETECT_PARADIGM} uiParadigm If set to
   * null, auto-set will be re-enabled.
   */
  setStaticUIParadigm(uiParadigm) {
    if (
      uiParadigm !== DESKTOP_PARADIGM &&
      uiParadigm !== MOBILE_PARADIGM &&
      uiParadigm !== AUTO_DETECT_PARADIGM
    ) {
      throw new Error(
        `uiParadigm must be set to "${DESKTOP_PARADIGM}", "${MOBILE_PARADIGM}", or null`
      );
    }

    if (uiParadigm) {
      this.setState({
        uiParadigm,
        // Skip auto-set
        isAutoSet: false,
      });
    } else {
      this.setState({
        uiParadigm: this._detectUIParadigm(),
        // Reset to auto-set
        isAutoSet: true,
      });
    }
  }

  /**
   * Retrieves if the UI paradigm is automatically set, otherwise being
   * manually set.
   *
   * @return {boolean}
   */
  getIsAutoSet() {
    return this.getState().isAutoSet;
  }

  /**
   * Retrieves the paradigm of the ReShell environment.
   *
   * @return {DESKTOP_PARADIGM | MOBILE_PARADIGM}
   */
  getUIParadigm() {
    return this.getState().uiParadigm;
  }

  /**
   * Detects the current desktop paradigm.
   *
   * @return {boolean}
   */
  _detectUIParadigm() {
    const { screenWidth, screenHeight } = this._screenService.getState();

    let uiParadigm = DESKTOP_PARADIGM;

    if (
      screenWidth < DESKTOP_MINIMUM_WIDTH ||
      screenHeight < DESKTOP_MINIMUM_HEIGHT
    ) {
      uiParadigm = MOBILE_PARADIGM;
    }

    return uiParadigm;
  }
}
