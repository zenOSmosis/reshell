import UIServiceCore, { EVT_UPDATED } from "@core/classes/UIServiceCore";

export { EVT_UPDATED };

/**
 * UI service class for screen resolution detection.
 */
export default class ScreenService extends UIServiceCore {
  constructor(...args) {
    super(...args);

    this.setTitle("Screen Service");

    this.setState({
      screenWidth: null,
      screenHeight: null,
    });

    // Monitor resolution changes
    (() => {
      // FIXME: (jh) Debounce?
      const _handleViewportResize = () => {
        const { width: screenWidth, height: screenHeight } =
          this._detectScreenResolution();

        this.setState({
          screenWidth,
          screenHeight,
        });
      };

      // TODO: Use common handler instead
      window.addEventListener("resize", _handleViewportResize);

      this.registerCleanupHandler(() => {
        window.removeEventListener("resize", _handleViewportResize);
      });

      // Capture initial size
      _handleViewportResize();
    })();
  }

  /**
   * @return {{width: number, height: number}}
   */
  getScreenResolution() {
    const { screenWidth: width, screenHeight: height } = this.getState();

    return {
      width,
      height,
    };
  }

  /**
   * Detects the current screen resolution.
   *
   * @return {{width: number, height: number}}
   */
  _detectScreenResolution() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    return {
      width,
      height,
    };
  }

  // TODO: fetchMonitorRefreshRate (via request-skippable-animation-frame)
}
