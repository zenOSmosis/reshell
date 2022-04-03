import registerSpyAgent from "../registerSpyAgent";

const NativeWebSocket = window.WebSocket;

if (NativeWebSocket) {
  registerSpyAgent(
    NativeWebSocket,
    { address: null, isOpen: false },
    createSpyAgent => {
      /**
       * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
       */
      class WebSocketSpy extends NativeWebSocket {
        constructor(address, ...args) {
          super(address, ...args);

          let spyAgent = createSpyAgent(this);

          this.addEventListener("open", () => {
            // TODO: Remove
            console.debug("open", this);

            if (!spyAgent) {
              spyAgent = createSpyAgent(this);
            }
            spyAgent.setState({ isOpen: true });
          });

          this.addEventListener("close", () => {
            // TODO: Remove
            console.debug("close", this);

            spyAgent.destroy();
          });

          this.addEventListener("error", error => {
            // TODO: Remove
            console.error(error);

            spyAgent.destroy();
          });
        }
      }

      // Override the native WebSocket object
      window.WebSocket = WebSocketSpy;
    }
  );
}
