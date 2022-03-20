import { PhantomState, EVT_UPDATED, EVT_DESTROYED, sleep } from "phantom-core";
import { debounce } from "debounce";

import getElPosition from "@utils/getElPosition";
import getElSize from "@utils/getElSize";

import requestSkippableAnimationFrame from "request-skippable-animation-frame";

export { EVT_UPDATED, EVT_DESTROYED };

// @see https://reactjs.org/docs/profiler.html
export const EVT_RENDER_PROFILED = "render-profile";

export const EVT_RESIZED = "resized";
export const EVT_MOVED = "moved";

// Number of milliseconds to wait after a restore operation before running a
// positioning effect such as scattering or centering. This is necessary in
// order to allow all restore calculations (along with their CSS transitions,
// etc.) to occur before trying to run the position effect calculations.
const POST_RESTORE_POSITION_EFFECT_TIMEOUT = 1000;

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

    this._elWindow = null;
    this._elWindowManager = null;

    this._handleBringToTop = onBringToTop;

    this._emitDebouncedResized = debounce(
      this._emitDebouncedResized.bind(this),
      500,
      // Ensure runs on trailing edge
      false
    );

    this._emitDebouncedMoved = debounce(
      this._emitDebouncedMoved.bind(this),
      500,
      // Ensure runs on trailing edge
      false
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
    return super.destroy(async () => {
      // Clear any currently scheduled resize executions
      this._emitDebouncedResized.clear();

      // TODO: Determine if in dirty state, prior to closing
      // TODO: Replace w/ UIModal
      // if (
      // window.confirm(`Are you sure you wish to close "${this.getTitle()}"?`)
      // ) {

      if (this._appRuntime && !this._appRuntime.getIsDestroying()) {
        await this._appRuntime.destroy();
      }

      this._appRuntime = null;
      this._elWindow = null;
      this._elWindowManager = null;
    });

    //}
  }

  // TODO: Document
  __INTERNAL__setCenterHandler(centerHandler) {
    this._centerHandler = centerHandler;
  }

  // TODO: Document
  async center() {
    if (this.getIsMaximized() || this.getIsMinimized()) {
      this.restore();

      // NOTE: Sleep is used to allow window time to restore and effects run,
      // otherwise it may not center correctly
      await sleep(POST_RESTORE_POSITION_EFFECT_TIMEOUT);
    }

    if (!this.getIsDestroying()) {
      this._centerHandler();
    }
  }

  // TODO: Document
  __INTERNAL__setScatterHandler(scatterHandler) {
    this._scatterHandler = scatterHandler;
  }

  // TODO: Document
  async scatter() {
    if (this.getIsMaximized() || this.getIsMinimized()) {
      this.restore();

      // NOTE: Sleep is used to allow window time to restore and effects run,
      // otherwise it may not scatter correctly
      await sleep(POST_RESTORE_POSITION_EFFECT_TIMEOUT);
    }

    if (!this.getIsDestroying()) {
      this._scatterHandler();
    }
  }

  // TODO: Document
  // TODO: Rename to bringToFront and / or activate
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
  __INTERNAL__attachWindowElement(el) {
    this._elWindow = el;
  }

  // TODO: Document
  __INTERNAL__attachWindowManagerElement(el) {
    this._elWindowManager = el;
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
    // Skip if maximized
    if (this.getIsMaximized()) {
      return;
    }

    // IMPORTANT!: Do not update state on each iteration (if at all) because that would cause excessive re-rendering
    const elWindow = this._elWindow;
    if (elWindow) {
      // FIXME: (jh) Can these be applied as a single reflow?
      // @see https://www.sitepoint.com/10-ways-minimize-reflows-improve-performance/

      requestSkippableAnimationFrame(() => {
        if (width !== undefined) {
          elWindow.style.width = `${width}px`;
        }
        if (height !== undefined) {
          elWindow.style.height = `${height}px`;
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

  /**
   * Retrieves the window's size in pixels.
   *
   * @param {DOMElement} el
   * @return {{width: number, height: number}}
   */
  getSize() {
    const elWindow = this._elWindow;
    if (elWindow) {
      return getElSize(elWindow);
    } else {
      this.log.warn("Unable to acquire elWindow");
    }
  }

  /**
   * Retrieves the window manager's size in pixels.
   *
   * @param {DOMElement} el
   * @return {{width: number, height: number}}
   */
  getWindowManagerSize() {
    const elWindowManager = this._elWindowManager;
    if (elWindowManager) {
      return getElSize(elWindowManager);
    } else {
      this.log.warn("Unable to acquire elWindowManager");
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

    const elWindow = this._elWindow;
    if (elWindow) {
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
          elWindow.style.left = `${x}px`;

          // Delete opposing right style
          delete elWindow.style.right;
        }
        if (y !== undefined) {
          elWindow.style.top = `${y}px`;

          // Delete opposing bottom style
          delete elWindow.style.bottom;
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

  /**
   * Retrieves the window's upper-left-hand corner position relative to its
   * parent (the window manager).
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetLeft}
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetTop}
   *
   * @param {HTMLElement} el
   * @return {{x: number, y: number}}
   */
  getPosition() {
    const elWindow = this._elWindow;

    if (elWindow) {
      return getElPosition(elWindow);
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

    // Reset polar-opposite states
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
