import PhantomCore, { EVT_READY } from "phantom-core";

const EVT_WORKER_MESSAGE = "worker-message";
const EVT_PRE_READY = "pre-ready";

/**
 * Creates and maintains an RPC-controlled web worker, bound to a PhantomCore
 * lifecycle.
 *
 * IMPORTANT: This is the CONTROLLER script (i.e. can run on the main thread)
 */
export default class RPCPhantomWorker extends PhantomCore {
  /**
   * Retrieves whether or not web workers are supported in this browser.
   *
   * @return {boolean}
   */
  static getIsSupported() {
    return Boolean(window.Worker);
  }

  /**
   * @param {() => Worker} createWorker A function which returns a Worker instance
   */
  constructor(createWorker = () => new Worker("./worker", { type: "module" })) {
    super({ isAsync: true });

    /** @type {() => Worker} */
    this._createWorker = createWorker;

    /** @type {Worker} */
    this._worker = this._createWorker();

    // Automatically terminate the worker once this class is destructed
    this.registerCleanupHandler(() => {
      if (this._worker) {
        this._worker.terminate();
      }
    });

    this._worker.addEventListener("message", this._handleWorkerMessage);
    this.registerCleanupHandler(() => {
      this._worker.removeEventListener("message", this._handleWorkerMessage);
    });

    // Utilized for correlating responses with replies
    this._callIdx = -1;

    // TODO: Listen for worker to terminate and invoke destruct handler
    // (use ping events)

    this._init();
  }

  async _init() {
    // Wait for worker to signal it is ready
    //
    // Note: I guess that I could have used an internal onload event for this,
    // but this should ensure that it is actually ready to go.
    //
    // FIXME: (jh) Handle condition where this class could possibly be
    // destructed before the worker is ready
    await new Promise(resolve => this.once(EVT_PRE_READY, resolve));

    return super._init();
  }

  /**
   * Handles messages received from worker thread and routes them to a class
   * event.
   *
   * @param {MessageEvent} evt
   * @return {void}
   */
  _handleWorkerMessage(evt) {
    if (!this._isReady && evt.data === EVT_READY) {
      this.emit(EVT_PRE_READY);

      return;
    }

    if (evt.data.id !== undefined) {
      this.emit(EVT_WORKER_MESSAGE, evt.data);
    }
  }

  /**
   * A simple RPC caller, loosely based on JSON-RPC.
   *
   * @see https://en.wikipedia.org/wiki/JSON-RPC
   *
   * @param {string} method
   * @param {Object} params
   * @return {Promise<any>}
   */
  async call(method, params) {
    return new Promise((resolve, reject) => {
      const id = ++this._callIdx;

      // FIXME: (jh) Migrate to MessagePort implementation?
      // @see https://developer.mozilla.org/en-US/docs/Web/API/MessagePort
      this._worker.postMessage({ method, params, id });

      const _handleWorkerMessage = data => {
        const { id: responseId, result, error } = data;

        // Ensure the id matches the expected response
        if (id === responseId) {
          // Unregister the event listener
          this.off(EVT_WORKER_MESSAGE, _handleWorkerMessage);

          // Decrease max listeners count by one
          this.setMaxListeners(this.getMaxListeners() - 1);

          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      };

      // Increase max listeners count by one; this fixes an issue where rapidly
      // calling RPC methods could lead to memory leak warnings (i.e. invoking
      // a call per keystroke)
      this.setMaxListeners(this.getMaxListeners() + 1);

      this.on(EVT_WORKER_MESSAGE, _handleWorkerMessage);
    });
  }

  /**
   * @alias this.destroy
   *
   * @return {Promise<void>}
   */
  async terminate() {
    this._worker.terminate();

    return this.destroy();
  }
}
