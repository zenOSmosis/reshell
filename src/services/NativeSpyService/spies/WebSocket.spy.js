const NativeWebSocket = window.WebSocket;

if (NativeWebSocket) {
  class WebSocketSpy extends NativeWebSocket {
    constructor(...args) {
      super(...args);

      // TODO: Handle
      this.addEventListener("open", () => {
        // TODO: Remove
        console.log("open", this);
      });

      // TODO: Handle
      this.addEventListener("close", () => {
        // TODO: Remove
        console.log("close", this);
      });

      // TODO: Handle
      this.addEventListener("error", error => {
        // TODO: Remove
        console.error(error);
      });
    }
  }

  window.WebSocket = WebSocketSpy;
}
