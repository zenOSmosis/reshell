import PhantomCore, { EVT_UPDATED, EVT_DESTROYED } from "phantom-core";

export { EVT_UPDATED, EVT_DESTROYED };

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

    return super.destroy();
    //}
  }

  // TODO: Document
  attachWindowElement(el) {
    this._windowEl = el;
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
        x: windowEl.offsetLeft,
        y: windowEl.offsetTop,
      };
    }
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
