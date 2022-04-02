import SpyAgentCore from "./SpyAgentCore";

const NativeWebSocket = window.WebSocket;

if (NativeWebSocket) {
  const initSpyAgent = (initialState = { address: null, isOpen: false }) =>
    SpyAgentCore.createSpyAgent(NativeWebSocket, initialState);

  class WebSocketSpy extends NativeWebSocket {
    constructor(address, ...args) {
      super(address, ...args);

      let spyAgent = initSpyAgent({
        address,
        isOpen: false,
      });

      this.addEventListener("open", () => {
        // TODO: Remove
        console.log("open", this);

        if (!spyAgent) {
          spyAgent = initSpyAgent({ address, isOpen: false });
        }
        spyAgent.setState({ isOpen: true });
      });

      this.addEventListener("close", () => {
        // TODO: Remove
        console.log("close", this);

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
