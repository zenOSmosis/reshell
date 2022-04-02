import registerSpyAgent from "../registerSpyAgent";
import SpyAgentCore from "./SpyAgentCore";

const NativeWebSocket = window.WebSocket;

if (NativeWebSocket) {
  registerSpyAgent(() => {
    // TODO: Implement ability to automatically close

    const initSpyAgent = (initialState = { address: null, isOpen: false }) =>
      SpyAgentCore.createSpyAgent(NativeWebSocket, initialState);

    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
     */
    class WebSocketSpy extends NativeWebSocket {
      constructor(address, ...args) {
        super(address, ...args);

        let spyAgent = initSpyAgent({
          address,
          isOpen: false,
        });

        this.addEventListener("open", () => {
          // TODO: Remove
          console.debug("open", this);

          if (!spyAgent) {
            spyAgent = initSpyAgent({ address, isOpen: false });
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

    return NativeWebSocket;
  });
}
