import registerSpyAgent from "../registerSpyAgent";

const NativeWorker = window.Worker;

if (NativeWorker) {
  registerSpyAgent(
    NativeWorker,
    { url: null, isOpen: false, error: null },
    invokeSpyAgent => {
      /**
       * @see hhttps://developer.mozilla.org/en-US/docs/Web/API/Worker
       */
      class WorkerSpy extends NativeWorker {
        constructor(url, ...args) {
          super(url, ...args);

          // Initiate spy agent with initial state for this Worker instance
          invokeSpyAgent(this, { url, isOpen: true });

          this.addEventListener("error", error => {
            invokeSpyAgent(this, { error });
          });

          // TODO: Poll to determine if still open? We can determine if "closed
          // from the outside" via wrapping terminate, but may need to poll if
          // closing from the inside
        }

        /**
         * @return {void}
         */
        terminate() {
          super.terminate();

          invokeSpyAgent(this, { isOpen: false }).destroy();
        }
      }

      // Override the native Worker object
      window.Worker = WorkerSpy;
    }
  );
}
