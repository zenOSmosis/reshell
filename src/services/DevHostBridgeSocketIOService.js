import SocketIOService from "@services/SocketIOService";

// TODO: Rename w/ PROTO_ prefix?
export default class DevHostBridgeSocketIOService extends SocketIOService {
  constructor(...args) {
    super(...args);

    // Automatically connect
    this.connect();
  }

  // TODO: Document
  connect(options = {}) {
    super.connect({
      path: `/dev.hostbridge`,
      ...options,
    });
  }
}
