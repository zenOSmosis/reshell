import UIServiceCore, { EVT_UPDATED } from "@core/classes/UIServiceCore";
import SpeakerAppSocketAuthenticationService, {
  EVT_CONNECTED,
} from "./SpeakerAppSocketAuthenticationService";
import SpeakerAppLocalZenRTCPeerService from "./SpeakerAppLocalZenRTCPeerService";

import {
  SOCKET_API_ROUTE_FETCH_NETWORKS,
  SOCKET_API_ROUTE_FETCH_ICE_SERVERS,
} from "../shared/socketAPIRoutes";
import { SOCKET_EVT_NETWORKS_UPDATED } from "../shared/socketEvents";

export default class SpeakerAppNetworkService extends UIServiceCore {
  constructor({ ...args }) {
    super({
      ...args,
    });

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

    this._localZenRTCPeerService = this.useServiceClass(
      SpeakerAppLocalZenRTCPeerService
    );
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

  // TODO: Document
  async connectToNetwork(network) {
    const { realmID, channelID } = network;
    return this._localZenRTCPeerService.connect({ realmID, channelID });
  }

  // TODO: Document
  disconnectFromNetwork(network) {
    const { realmID, channelID } = network;
    return this._localZenRTCPeerService.disconnect({ realmID, channelID });
  }
}
