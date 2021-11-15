import UIServiceCore from "@core/classes/UIServiceCore";
import LocalDeviceIdentificationService from "@services/LocalDeviceIdentificationService";

import SpeakerAppSocketAuthenticationService from "./SpeakerAppSocketAuthenticationService";
import VirtualServerZenRTCPeerManager from "../zenRTC/VirtualServerZenRTCPeerManager";

import {
  SOCKET_API_ROUTE_INIT_VIRTUAL_SERVER_SESSION,
  SOCKET_API_ROUTE_END_VIRTUAL_SERVER_SESSION,
} from "../shared/socketAPIRoutes";

// TODO: Document (used for network hosting)
export default class SpeakerAppNetworkHostService extends UIServiceCore {
  constructor({ ...args }) {
    super({
      ...args,
    });

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
  // TODO: Wire up to virtualServer
  async createVirtualServer(params) {
    // TODO: Init multi-peer manager here
    // TODO: Adjust params with some sort of parameter in order for remote peer's "LocalZenRTCSignalBroker" to be able to reach this network host

    const socketService = this.useServiceClass(
      SpeakerAppSocketAuthenticationService
    );

    const socket = socketService.getSocket();

    const hostDeviceAddress = await this.useServiceClass(
      LocalDeviceIdentificationService
    ).fetchLocalAddress();

    /*
    try {
      await this._socketService.fetchSocketAPICall(
        SOCKET_API_ROUTE_INIT_VIRTUAL_SERVER_SESSION,
        params
      );

      this.setState({ isHosting: true, realmId, channelId });
    } catch (err) {
      // TODO: Handle error
      throw err;
    }
    */

    const { realmId, channelId } = params;

    const virtualServer = new VirtualServerZenRTCPeerManager({
      realmId,
      channelId,
      hostDeviceAddress,
      socket,
    });

    // TODO: Remove
    console.log({
      virtualServer,
      hostDeviceAddress,
    });
  }

  // TODO: Document
  // TODO: Wire up to virtualServer
  async stopVirtualServer() {
    await this._socketService.fetchSocketAPICall(
      SOCKET_API_ROUTE_END_VIRTUAL_SERVER_SESSION
    );

    this.setState({ isHosting: false, realmId: null, channelId: null });
  }
}
