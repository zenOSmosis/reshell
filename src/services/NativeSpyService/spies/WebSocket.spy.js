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

          // Initiate spy agent with initial state for this WebSocket instance
          invokeSpyAgent(this, { address });

          this.addEventListener("open", () => {
            // Register open state w/ spy agent
            invokeSpyAgent(this, { isOpen: true, error: null });
          });

          // TODO: Inspect traffic?

          this.addEventListener("close", () => {
            // Register close state w/ spy agent, then destruct the agent
            invokeSpyAgent(this, { isOpen: false }).destroy();
          });

          this.addEventListener("error", error => {
            // Register error state w/ spy agent, then destruct the agent
            invokeSpyAgent(this, { error }).destroy();
          });
        }
      }

      // Override the native WebSocket object
      window.WebSocket = WebSocketSpy;
    }
  );
}
