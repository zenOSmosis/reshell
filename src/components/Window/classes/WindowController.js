import PhantomCore, { EVT_UPDATED, EVT_DESTROYED } from "phantom-core";

export { EVT_UPDATED, EVT_DESTROYED };

export const EVT_RENDERED = "rendered";

// TODO: Move into core directory?
// TODO: Document
export default class WindowController extends PhantomCore {
  constructor(initialState = {}) {
    super();

    const DEFAULT_STATE = {
      isMaximized: false,
      isMinimized: false,
      title: this.getTitle(),
    };

    this._state = Object.seal(
      WindowController.mergeOptions(DEFAULT_STATE, initialState)
    );

    this._appRuntime = null;

    this._windowEl = null;
    this._windowManagerEl = null;
  }

  /**
   * @return {Promise<void>}
   */
  async destroy() {
    // TODO: Determine if in dirty state, prior to closing
    // if (
    // window.confirm(`Are you sure you wish to close "${this.getTitle()}"?`)
    // ) {

    if (this._appRuntime) {
      await this._appRuntime.destroy();
    }

    this._state = {};
    this._appRuntime = null;
    this._windowEl = null;
    this._windowManagerEl = null;

    return super.destroy();
    //}
  }

  // TODO: Document
  // TODO: Use for debugging (but available in production)
  emitRender() {
    this.emit(EVT_RENDERED);
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

  // TODO: Implement
  // TODO: Document
  setSize({ width, height }) {
    // IMPORTANT!: Do not update state on each iteration (if at all) because that would cause excessive re-rendering
    const windowEl = this._windowEl;
    if (windowEl) {
      if (width !== undefined) {
        windowEl.style.width = `${width}px`;
      }
      if (height !== undefined) {
        windowEl.style.height = `${height}px`;
      }
    }
  }

  // TODO: Document
  getSize() {
    // TODO: If unable to acquire style size for any dimension, return the calculated value

    // issues
    const windowEl = this._windowEl;
    if (windowEl) {
      // IMPORTANT: Not always using calculated size due to potential performance
      return {
        width: parseInt(windowEl.style.width, 10),
        height: parseInt(windowEl.style.height, 10),
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

  // TODO: Implement
  // TODO: Document
  setPosition({ x, y }) {
    // IMPORTANT!: Do not update state on each iteration (if at all) because that would cause excessive re-rendering
    const windowEl = this._windowEl;
    if (windowEl) {
      if (x !== undefined) {
        windowEl.style.left = `${x}px`;
      }
      if (y !== undefined) {
        windowEl.style.top = `${y}px`;
      }
    }
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

    // TODO: Refactor title to app runtime passing (ensure it can work both ways)
    if (partialNextState.title !== undefined && this._appRuntime) {
      this._appRuntime.setTitle(partialNextState.title);
    }

    // Potentially reset polar-opposite states
    if (partialNextState.isMaximized) {
      this._state.isMinimized = false;
    } else if (partialNextState.isMinimized) {
      this._state.isMaximized = false;
    }

    // TODO: This is buggy with certain types of state objects; should we just do a shallow-merge instead?
    this._state = PhantomCore.mergeOptions(this._state, partialNextState);

    this.emit(EVT_UPDATED, partialNextState);
  }

  /**
   * @param {string} title
   * @return {void}
   */
  setTitle(title) {
    // Fixes issue where title does not render in window
    this.setState({ title });

    super.setTitle(title);
  }

  /**
   * @return {Object}
   */
  getState() {
    return this._state;
  }

  /**
   * @param {boolean} isMaximized
   * @return {void}
   */
  setIsMaximized(isMaximized) {
    return this.setState({ isMaximized });
  }

  /**
   * Retrieves whether or not the window is maximized.
   *
   * @returns {boolean}
   */
  getIsMaximized() {
    return this._state.isMaximized;
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

  /**
   * Retrieves whether or not the window is minimized.
   *
   * @return {boolean}
   */
  getIsMinimized() {
    return this._state.isMinimized;
  }
}
