import PhantomCore from "phantom-core";

const EVT_WORKER_MESSAGE = "worker-message";

// TODO: Document (controller which runs on main thread)
export default class RPCPhantomWorker extends PhantomCore {
  // TODO: Document
  constructor(createWorker = () => new Worker("./worker", { type: "module" })) {
    super();

    /** @type {() => Worker} */
    this._createWorker = createWorker;

    /** @type {Worker} */
    this._worker = this._createWorker();
    this.registerCleanupHandler(() => {
      if (this._worker) {
        this._worker.terminate();
      }
    });

    this._worker.addEventListener("message", this._handleWorkerMessage);
    this.registerCleanupHandler(() => {
      this._worker.removeEventListener("message", this._handleWorkerMessage);
    });

    this._callIdx = -1;

    // TODO: Listen for worker to terminate and invoke destruct handler
    // (use ping events)
  }

  /**
   * Handles messages received from worker thread and routes them to a class
   * event.
   *
   * @param {MessageEvent} evt
   * @return {void}
   */
  _handleWorkerMessage(evt) {
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

          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      };

      this.on(EVT_WORKER_MESSAGE, _handleWorkerMessage);
    });
  }
}
