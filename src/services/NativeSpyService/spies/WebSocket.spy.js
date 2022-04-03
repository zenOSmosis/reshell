import registerSpyAgent from "../registerSpyAgent";

const NativeWebSocket = window.WebSocket;

if (NativeWebSocket) {
  registerSpyAgent(
    NativeWebSocket,
    { address: null, isOpen: false, error: null },
    invokeSpyAgent => {
      /**
       * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
       */
      class WebSocketSpy extends NativeWebSocket {
        constructor(address, ...args) {
          super(address, ...args);

          invokeSpyAgent(this);

          this.addEventListener("open", () => {
            // TODO: Remove
            console.debug("open", this);

            // Register open state w/ spy agent
            invokeSpyAgent(this, { isOpen: true, error: null });
          });

          this.addEventListener("close", () => {
            // TODO: Remove
            console.debug("close", this);

            // Register close state w/ spy agent
            invokeSpyAgent(this, { isOpen: false }).destroy();
          });

          this.addEventListener("error", error => {
            // TODO: Remove
            console.error(error);

            // Register error state w/ spy agent
            invokeSpyAgent(this, { error }).destroy();
          });
        }
      }

      // Override the native WebSocket object
      window.WebSocket = WebSocketSpy;
    }
  );
}
