import UIServiceCore, { EVT_UPDATED } from "@core/classes/UIServiceCore";
import SpeakerAppSocketAuthenticationService, {
  EVT_CONNECTED,
} from "./SpeakerAppSocketAuthenticationService";

import {
  SOCKET_API_ROUTE_FETCH_NETWORKS,
  SOCKET_API_ROUTE_FETCH_NETWORK_EXISTS,
  SOCKET_API_ROUTE_FETCH_ICE_SERVERS,
} from "../shared/socketAPIRoutes";
import { SOCKET_EVT_NETWORKS_UPDATED } from "../shared/socketEvents";

// TODO: Document
export default class SpeakerAppNetworkDiscoveryService extends UIServiceCore {
  constructor(...args) {
    super(...args);

    this.setTitle("Speaker.app Network Discovery Service");

    // TODO: Move to setInitialState once available
    this.setState({
      networks: [],
    });

    this._socketService = this.useServiceClass(
      SpeakerAppSocketAuthenticationService
    );

    // Set up network fetching once socket is ready
    this.proxyOnce(this._socketService, EVT_CONNECTED, () => {
      const socket = this._socketService.getSocket();

      const handleNetworksUpdated = () => this.fetchNetworks();

      socket.on(SOCKET_EVT_NETWORKS_UPDATED, handleNetworksUpdated);

      this.registerShutdownHandler(() => {
        socket.off(SOCKET_EVT_NETWORKS_UPDATED, handleNetworksUpdated);
      });
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

  /**
   * @param {Object} network
   * @return {Promise<boolean>}
   */
  async fetchIsNetworkOnline({ realmId, channelId }) {
    return this._socketService.fetchSocketAPICall(
      SOCKET_API_ROUTE_FETCH_NETWORK_EXISTS,
      { realmId, channelId }
    );
  }

  // TODO: Document
  // Cached state of fetchNetworks call
  getNetworks() {
    return this.getState().networks;
  }

  // TODO: Document
  fetchICEServers() {
    return this._socketService.fetchSocketAPICall(
      SOCKET_API_ROUTE_FETCH_ICE_SERVERS
    );
  }
}
