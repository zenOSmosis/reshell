import UIServiceCore, { EVT_UPDATED } from "@core/classes/UIServiceCore";
import SpeakerAppSocketAuthenticationService from "./SpeakerAppSocketAuthenticationService";

import { SOCKET_API_ROUTE_FETCH_NETWORKS } from "../shared/socketAPIRoutes";
import { SOCKET_EVT_NETWORKS_UPDATED } from "../shared/socketEvents";

export default class SpeakerAppNetworkService extends UIServiceCore {
  constructor() {
    super({
      networks: [],
    });

    this._socketService = this.useService(
      SpeakerAppSocketAuthenticationService
    );

    // TODO: Handle unbinding, etc (use PhantomCore proxy?); add onSocketEvent / emitSocketEvent / onceSocketEvent?
    this._socketService.getSocket().on(SOCKET_EVT_NETWORKS_UPDATED, () => {
      this.fetchNetworks();
    });

    this.proxyOn(this._socketService, EVT_UPDATED, () => {
      if (!this._socketService.getIsConnected()) {
        // Handle resetting of networks once socket goes offline
        this.setState({
          // Reset networks
          networks: [],
        });
      } else {
        // Fetch networks once socket comes online
        this.fetchNetworks();
      }
    });
  }

  // TODO: Document
  async fetchNetworks() {
    const networks = await this._socketService.fetchSocketAPICall(
      SOCKET_API_ROUTE_FETCH_NETWORKS
    );

    this.setState({ networks });

    // TODO: Remove
    console.log({ networks });

    return networks;
  }
}
