import { PhantomState, EVT_UPDATED, EVT_DESTROYED } from "phantom-core";
import { debounce } from "debounce";

import requestSkippableAnimationFrame from "request-skippable-animation-frame";

export { EVT_UPDATED, EVT_DESTROYED };

// @see https://reactjs.org/docs/profiler.html
export const EVT_RENDER_PROFILED = "render-profile";

export const EVT_RESIZED = "resized";
export const EVT_MOVED = "moved";

// TODO: Implement ability to take snapshot (i.e. save to png, etc) for window previewing

// TODO: Move into core directory?
// TODO: Document
export default class WindowController extends PhantomState {
  // TODO: Document
  constructor(initialState = {}, { onBringToTop }) {
    const DEFAULT_STATE = {
      isMaximized: false,
      isMinimized: false,
    };

    super(PhantomState.mergeOptions({ ...DEFAULT_STATE, ...initialState }));

    this._appRuntime = null;

    this._windowEl = null;
    this._windowManagerEl = null;

    this._handleBringToTop = onBringToTop;

    this._emitDebouncedResized = debounce(
      this._emitDebouncedResized.bind(this),
      500,
      // Ensure runs on trailing edge
      false
    );

    this._emitDebouncedMoved = debounce(
      this._emitDebouncedMoved.bind(this),
      500
    );

    // TODO: Retain last size / moved and enable reverting back to previous settings
    // TODO: Enable percentage calculation and adjust when resizing viewport (this should prevent windows from being able to leave the viewport)

    // TODO: Ensure these are unbound when controller is destructed (related issue: https://github.com/zenOSmosis/phantom-core/issues/68)
    // (For manually triggering Chrome's built-in Garbage Collector, see: https://github.com/facebook/react/issues/22471)
    this._centerHandler = null;
    this._scatterHandler = null;
  }

  /**
   * @return {Promise<void>}
   */
  async destroy() {
    // Clear any currently scheduled resize executions
    this._emitDebouncedResized.clear();

    // TODO: Determine if in dirty state, prior to closing
    // if (
    // window.confirm(`Are you sure you wish to close "${this.getTitle()}"?`)
    // ) {

    if (this._appRuntime) {
      await this._appRuntime.destroy();
    }

    this._appRuntime = null;
    this._windowEl = null;
    this._windowManagerEl = null;

    return super.destroy();
    //}
  }

  // TODO: Document
  __INTERNAL__setCenterHandler(centerHandler) {
    this._centerHandler = centerHandler;
  }

  // TODO: Document
  center() {
    return this._centerHandler();
  }

  // TODO: Document
  __INTERNAL__setScatterHandler(scatterHandler) {
    this._scatterHandler = scatterHandler;
  }

  // TODO: Document
  scatter() {
    return this._scatterHandler();
  }

  // TODO: Document
  bringToTop() {
    this._handleBringToTop(this);
  }

  // TODO: Document
  /*
  __INTERNAL__setIsActive(isActive) {
    if (isActive !== this.getIsActive()) {
      this.setState({ isActive });
    }
  }
  */

  // TODO: Document
  /*
  getIsActive() {
    return this.getState().isActive;
  }
  */

  // TODO: Document
  // @see https://reactjs.org/docs/profiler.html
  captureRenderProfile(arrRenderProfile) {
    this.emit(EVT_RENDER_PROFILED, arrRenderProfile);
  }

  // TODO: Document
  attachWindowElement(el) {
    this._windowEl = el;
  }

  // TODO: Document
  attachWindowManagerElement(el) {
    this._windowManagerEl = el;
  }

  /**
   * Associates an AppRuntime instance with this window controller.
   *
   * @param {AppRuntime} appRuntime
   * @return {void}
   */
  setAppRuntime(appRuntime) {
    // TODO: Ensure appRuntime is an AppRuntime instance

    this._appRuntime = appRuntime;

    // TODO: Refactor title to app runtime passing (ensure it can work both ways)
    this._appRuntime.setTitle(this.getTitle());
  }

  /**
   * Retrieves the associated AppRuntime for this window controller.
   *
   * @return {AppRuntime | void}
   */
  getAppRuntime() {
    return this._appRuntime;
  }

  // TODO: Document
  getAppRegistration() {
    const runtime = this.getAppRuntime();

    if (runtime) {
      return runtime.getRegistration();
    }
  }

  // TODO: Document
  setSize({ width, height }) {
    // IMPORTANT!: Do not update state on each iteration (if at all) because that would cause excessive re-rendering
    const windowEl = this._windowEl;
    if (windowEl) {
      // FIXME: (jh) Can these be applied as a single reflow?
      // @see https://www.sitepoint.com/10-ways-minimize-reflows-improve-performance/

      requestSkippableAnimationFrame(() => {
        if (width !== undefined) {
          windowEl.style.width = `${width}px`;
        }
        if (height !== undefined) {
          windowEl.style.height = `${height}px`;
        }

        // Emit debounced EVT_RESIZED event
        this._emitDebouncedResized();
      }, `${this._uuid}-size`);
    }
  }

  // TODO: Document
  _emitDebouncedResized() {
    this.emit(EVT_RESIZED);
  }

  // TODO: Document
  getSize() {
    const windowEl = this._windowEl;
    if (windowEl) {
      return {
        width: windowEl.offsetWidth,
        height: windowEl.offsetHeight,
      };
    } else {
      console.warn("Unable to acquire windowEl");
    }
  }

  // TODO: Document
  getWindowManagerSize() {
    const windowManagerEl = this._windowManagerEl;
    if (windowManagerEl) {
      return {
        width: parseInt(windowManagerEl.offsetWidth, 10),
        height: parseInt(windowManagerEl.offsetHeight, 10),
      };
    } else {
      console.warn("Unable to acquire windowManagerEl");
    }
  }

  // TODO: Document
  setPosition({ x, y }) {
    // Fixes issue where restoring using widow title bar (i.e. double-click or
    // using window control button) would make window go to upper-left of
    // screen
    if (this.getIsMaximized()) {
      return;
    }

    const windowEl = this._windowEl;
    if (windowEl) {
      /**
       * FIXME: (jh) While using translate would be better here, it is buggier
       * to use with some of the window animations (open / minimize / restore)
       *
       * However, if able to tie directly into matrix operations provided by
       * accelerated StackingContext, it might improve acceleration even
       * further
       *
       * Additional reading:
       *    - [will-change] https://developer.mozilla.org/en-US/docs/Web/CSS/will-change
       *    - [animating the box model]: https://whistlr.info/2021/box-model-animation
       */

      requestSkippableAnimationFrame(() => {
        if (x !== undefined) {
          windowEl.style.left = `${x}px`;

          // Delete opposing right style
          delete windowEl.style.right;
        }
        if (y !== undefined) {
          windowEl.style.top = `${y}px`;

          // Delete opposing bottom style
          delete windowEl.style.bottom;
        }

        // IMPORTANT!: Do not update state on each iteration (if at all)
        // because that would cause excessive re-rendering
        this._emitDebouncedMoved();
      }, `${this._uuid}-position`);
    }
  }

  // TODO: Document
  _emitDebouncedMoved() {
    this.emit(EVT_MOVED);
  }

  // TODO: Document
  getPosition() {
    const windowEl = this._windowEl;

    if (windowEl) {
      return {
        x: parseInt(windowEl.offsetLeft, 10),
        y: parseInt(windowEl.offsetTop, 10),
      };
    }
  }

  // TODO: Document
  getIsBorderDisabled() {
    return this.getIsMaximized() || this.getIsMinimized();
  }

  /**
   * Sets a partial next state for this window controller.
   *
   * TODO: States are currently deep-merged but may become shallow merged
   * instead.
   *
   * @param {Object} partialNextState
   * @emits EVT_UPDATED
   * @return {void}
   */
  setState(partialNextState) {
    if (typeof partialNextState !== "object") {
      throw new TypeError("partialNextState is not an object");
    }

    // Potentially reset polar-opposite states
    if (partialNextState.isMaximized) {
      partialNextState.isMinimized = false;
    } else if (partialNextState.isMinimized) {
      partialNextState.isMaximized = false;
    }

    return super.setState(partialNextState);
  }

  /**
   * @param {boolean} isMaximized
   * @return {void}
   */
  setIsMaximized(isMaximized) {
    return this.setState({ isMaximized });
  }

  // TODO: Document
  maximize() {
    return this.setIsMaximized(true);
  }

  /**
   * Retrieves whether or not the window is maximized.
   *
   * @returns {boolean}
   */
  getIsMaximized() {
    return this.getState().isMaximized;
  }

  /**
   * Sets whether or not the window is minimized.
   *
   * @param {boolean} isMinimized
   * @return {void}
   */
  setIsMinimized(isMinimized) {
    return this.setState({ isMinimized });
  }

  // TODO: Document
  minimize() {
    return this.setIsMinimized(true);
  }

  /**
   * Retrieves whether or not the window is minimized.
   *
   * @return {boolean}
   */
  getIsMinimized() {
    return this.getState().isMinimized;
  }

  // TODO: Document
  restore() {
    // IMPORTANT: The maximized / minimized states need to be set at the same
    // time here; don't call the individual methods directly
    this.setState({
      isMaximized: false,
      isMinimized: false,
    });
  }
}
