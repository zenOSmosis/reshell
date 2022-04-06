import PhantomCore from "phantom-core";

// TODO: Runs on main thread

// TODO: Extend Worker instead
export default class RPCWorker extends PhantomCore {
  constructor(
    createWorker = () => new Worker("./RPCWorker.worker", { type: "module" })
  ) {
    super();

    /** @type {() => Worker} */
    this._createWorker = createWorker;

    /** @type {Worker} */
    this._worker = null;
  }

  async call(method, params) {
    if (!this._worker) {
      this._worker = this._createWorker();
    }

    // TODO: Wait for worker to become ready?

    // TODO: Generate call id
  }

  async destroy() {
    if (this._worker) {
      this._worker.terminate();
    }
  }
}
