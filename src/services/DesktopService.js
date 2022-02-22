import UIServiceCore, {
  EVT_UPDATED,
  EVT_DESTROYED,
} from "@core/classes/UIServiceCore";

import WindowController from "@components/Window/classes/WindowController";

import UIParadigmService from "./UIParadigmService";

/**
 * Manages state for the DesktopServiceProvider.
 */
export default class DesktopService extends UIServiceCore {
  constructor(...args) {
    super(...args);

    this.setTitle("Desktop Service");

    this._uiParadigmService = this.useServiceClass(UIParadigmService);

    this.setState({
      isProfiling: false,
      activeWindowController: null,
      uiParadigm: this._uiParadigmService.getUIParadigm(),
      isUIParadigmAutoSet: this._uiParadigmService.getIsAutoSet(),
    });

    // Mirror UI paradigm service updates to local state
    //
    // FIXME: (jh) Perhaps get rid of UIParadigmService altogether; this
    // shouldn't need to be mirrored like this
    this._uiParadigmService.on(EVT_UPDATED, () => {
      this.setState({
        uiParadigm: this._uiParadigmService.getUIParadigm(),
        isUIParadigmAutoSet: this._uiParadigmService.getIsAutoSet(),
      });
    });

    // Auto-null activeWindowController state if the current one is destructed
    //
    // FIXME: (jh) This logic is a bit more complicated than it should be;
    // perhaps PhantomCore could offer some way of doing state comparisons
    // like dependencies do for React useEffect
    (() => {
      // Deactivate hook window controller state if destructed
      const _handleWindowControllerDestruct = () => {
        this.setActiveWindowController(null);
      };

      let prevActiveWindowController = null;

      this.on(EVT_UPDATED, () => {
        const activeWindowController = this.getActiveWindowController();

        // Only run comparison if active window controller has changed
        if (activeWindowController !== prevActiveWindowController) {
          if (prevActiveWindowController) {
            this.proxyOff(
              prevActiveWindowController,
              EVT_DESTROYED,
              _handleWindowControllerDestruct
            );
          }

          if (activeWindowController) {
            this.proxyOnce(
              activeWindowController,
              EVT_DESTROYED,
              _handleWindowControllerDestruct
            );
          }

          prevActiveWindowController = activeWindowController;
        }
      });
    })();
  }

  /**
   * Sets whether or not the windows should run React.Profiler.
   *
   * @see {@link https://reactjs.org/docs/profiler.html}
   *
   * @param {boolean} isProfiling
   * @return {void}
   */
  setIsProfiling(isProfiling) {
    this.setState({ isProfiling });
  }

  /**
   * Retrieves whether or not the windows are running React.Profiler.
   *
   * @see {@link https://reactjs.org/docs/profiler.html}
   *
   * @return {boolean}
   */
  getIsProfiling() {
    return this.getState().isProfiling;
  }

  /**
   * Sets the active (top-most) window.
   *
   * @param {WindowController | null} activeWindowController
   */
  setActiveWindowController(activeWindowController) {
    if (
      activeWindowController !== null &&
      !(activeWindowController instanceof WindowController)
    ) {
      throw new TypeError("activeWindowController must be a WindowController");
    }

    this.setState({ activeWindowController });
  }

  /**
   * Retrieves the active (top-most) window controller.
   *
   * @return {WindowController | null}
   */
  getActiveWindowController() {
    return this.getState().activeWindowController;
  }

  /**
   * @typedef {import('./UIParadigmService').DESKTOP_PARADIGM} DESKTOP_PARADIGM
   * @typedef {import('./UIParadigmService').MOBILE_PARADIGM} MOBILE_PARADIGM
   *
   * @param {DESKTOP_PARADIGM | MOBILE_PARADIGM | null} staticUIParadigm If set
   * to null, auto-set will be re-enabled.
   */
  setStaticUIParadigm(staticUIParadigm) {
    this._uiParadigmService.setStaticUIParadigm(staticUIParadigm);
  }
}
