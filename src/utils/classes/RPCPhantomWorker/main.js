import PhantomCore from "phantom-core";

// TODO: Document (controller which runs on main thread)
export default class RPCPhantomWorker extends PhantomCore {
  // TODO: Document
  constructor(createWorker = () => new Worker("./worker", { type: "module" })) {
    super();

    /** @type {() => Worker} */
    this._createWorker = createWorker;

    /** @type {Worker} */
    this._worker = null;

    this._callIdx = -1;
  }

  // TODO: Document
  async call(method, params) {
    if (!this._worker) {
      this._worker = this._createWorker();
    }

    // TODO: Wait for worker to become ready?

    this._worker.postMessage({ method, params, id: ++this._callIdx });

    // TODO: Implement ability to link response method to the original request
  }

  /**
   * @return {Promise<void>}
   */
  async destroy() {
    if (this._worker) {
      this._worker.terminate();
    }

    return super.destroy();
  }
}
