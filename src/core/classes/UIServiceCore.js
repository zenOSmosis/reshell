import PhantomCore, { EVT_UPDATED, EVT_DESTROYED } from "phantom-core";

export { EVT_UPDATED, EVT_DESTROYED };

// TODO: Document
export default class UIServiceCore extends PhantomCore {
  constructor(initialState = {}) {
    const DEFAULT_STATE = {
      title: "[Untitled Service]",
    };

    super();

    this._state = Object.seal(
      UIServiceCore.mergeOptions(DEFAULT_STATE, initialState)
    );
  }

  // TODO: Document
  setState(partialNextState = {}) {
    this._state = { ...this._state, ...partialNextState };

    this.emit(EVT_UPDATED, partialNextState);
  }

  // TODO: Document
  getState() {
    return this._state;
  }
}
