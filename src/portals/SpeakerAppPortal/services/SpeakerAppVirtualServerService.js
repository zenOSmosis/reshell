import UIServiceCore from "@core/classes/UIServiceCore";
import LocalDeviceIdentificationService from "@services/LocalDeviceIdentificationService";
import SpeakerAppSocketAuthenticationService from "./SpeakerAppSocketAuthenticationService";
import VirtualServerZenRTCPeerManager from "../zenRTC/VirtualServerZenRTCPeerManager";
import {
  SOCKET_API_ROUTE_INIT_VIRTUAL_SERVER_SESSION,
  SOCKET_API_ROUTE_END_VIRTUAL_SERVER_SESSION,
} from "../shared/socketAPIRoutes";

// TODO: Document (used for network hosting)

export default class SpeakerAppVirtualServerService extends UIServiceCore {
  constructor({ ...args }) {
    super({
      ...args,
    });

    this._socketService = this.useServiceClass(
      SpeakerAppSocketAuthenticationService
    );

    this._peerManager = null;

    // TODO: Migrate to setInitialState once available
    this.setState({
      isHosting: false,
      realmId: null,
      channelId: null,
    });
  }

  // TODO: Document
  getIsHosting() {
    return this.getState().isHosting;
  }

  // TODO: Document
  getNetworkRoute() {
    const { realmId, channelId } = this.getState();

    return {
      realmId,
      channelId,
    };
  }

  // TODO: Document
  async createVirtualServer(params) {
    if (this._peerManager) {
      console.warn(
        "Peer manager already exists; ignoring createVirtualManager call"
      );
      return;
    }

    // TODO: Init multi-peer manager here
    // TODO: Adjust params with some sort of parameter in order for remote peer's "LocalZenRTCSignalBroker" to be able to reach this network host
    const socket = this._socketService.getSocket();

    const hostDeviceAddress = await this.useServiceClass(
      LocalDeviceIdentificationService
    ).fetchLocalAddress();

    // Register server on network
    await this._socketService.fetchSocketAPICall(
      SOCKET_API_ROUTE_INIT_VIRTUAL_SERVER_SESSION,
      params
    );

    const { realmId, channelId } = params;

    this._peerManager = new VirtualServerZenRTCPeerManager({
      realmId,
      channelId,
      hostDeviceAddress,
      socket,
    });

    this._peerManager.registerShutdownHandler(async () => {
      await this.stopVirtualServer();

      this._peerManager = null;
    });

    this.setState({ isHosting: true, realmId: realmId, channelId: channelId });
  }

  // TODO: Document
  // TODO: Wire up to virtualServer
  async stopVirtualServer() {
    await this._socketService.fetchSocketAPICall(
      SOCKET_API_ROUTE_END_VIRTUAL_SERVER_SESSION
    );

    await this._peerManager.destroy();

    this.setState({ isHosting: false, realmId: null, channelId: null });
  }
}
