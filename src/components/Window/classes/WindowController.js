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
  }

  // TODO: Document
  setAppRuntime(appRuntime) {
    this._appRuntime = appRuntime;

    // TODO: Refactor title to app runtime passing (ensure it can work both ways)
    this._appRuntime.setTitle(this.getTitle());
  }

  // TODO: Document
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

  // TODO: Document
  getState() {
    return this._state;
  }

  // TODO: Document
  setIsMaximized({ isMaximized }) {
    return this.setState({ isMaximized });
  }

  // TODO: Document
  getIsMaximized() {
    return this._state.isMaximized;
  }

  // TODO: Document
  setIsMinimized({ isMinimized }) {
    return this.setState({ isMinimized });
  }

  // TODO: Document
  getIsMinimized() {
    return this._state.isMinimized;
  }

  /**
   * @return {Promise<void>}
   */
  async destroy() {
    if (this._appRuntime) {
      await this._appRuntime.destroy();
    }

    // TODO: Determine if in dirty state, prior to closing
    // if (
    // window.confirm(`Are you sure you wish to close "${this.getTitle()}"?`)
    // ) {
    return super.destroy();
    //}
  }
}
