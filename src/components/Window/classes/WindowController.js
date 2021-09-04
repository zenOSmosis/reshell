import PhantomCore, {
  PhantomCollection,
  EVT_UPDATED,
  EVT_DESTROYED,
} from "phantom-core";

export { EVT_UPDATED, EVT_DESTROYED };

// TODO: Make singleton instance
class _WindowMonitor extends PhantomCollection {
  /*
  constructor(...args) {
    super(...args);

    this.on(EVT_UPDATED, () => {
      // TODO: Remove
      console.log({
        windowControllers: this.getChildren(),
      });
    });
  }
  */

  /**
   * @param {WindowController} windowController
   * @return {void}
   */
  addChild(windowController) {
    if (!(windowController instanceof WindowController)) {
      throw new TypeError("windowController is not a WindowController");
    }

    super.addChild(windowController);
  }

  /**
   * @return {void}
   */
  destroy() {
    throw new Error("windowMonitor cannot be destroyed");
  }
}

export const windowMonitor = new _WindowMonitor();

export default class WindowController extends PhantomCore {
  constructor(initialState = {}) {
    const DEFAULT_STATE = {
      isMaximized: false,
      isMinimized: false,
      title: "[Untitled Window]",
    };

    super();

    this._state = Object.seal(
      WindowController.mergeOptions(DEFAULT_STATE, initialState)
    );

    windowMonitor.addChild(this);

    this._domElement = null;
  }

  // TODO: Document
  setDOMElement(domElement) {
    // IMPORTANT: Don't useState state here or an infinite loop can happen
    this._domElement = domElement;
  }

  // TODO: Document
  getDOMElement() {
    return this._domElement;
  }

  // TODO: Document
  setState(partialNextState) {
    // Potentially reset polar-opposite states
    if (partialNextState.isMaximized) {
      this._state.isMinimized = false;
    } else if (partialNextState.isMinimized) {
      this._state.isMaximized = false;
    }

    this._state = PhantomCore.mergeOptions(this._state, partialNextState);

    this.emit(EVT_UPDATED, partialNextState);
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

  // TODO: Document
  setTitle(title) {
    return this.setState({ title });
  }

  // TODO: Document
  getTitle() {
    return this._state.title;
  }

  /**
   * @return {Promise<void>}
   */
  async close() {
    return this.destroy();
  }

  /**
   * @return {Promise<void>}
   */
  async destroy() {
    // TODO: Determine if in dirty state, prior to closing
    // if (
    // window.confirm(`Are you sure you wish to close "${this.getTitle()}"?`)
    // ) {
    return super.destroy();
    //}
  }
}
