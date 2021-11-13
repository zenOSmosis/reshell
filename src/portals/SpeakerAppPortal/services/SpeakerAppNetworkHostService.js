import UIServiceCore from "@core/classes/UIServiceCore";
import SpeakerAppSocketAuthenticationService from "./SpeakerAppSocketAuthenticationService";

import {
  SOCKET_API_ROUTE_INIT_VIRTUAL_SERVER_SESSION,
  SOCKET_API_ROUTE_END_VIRTUAL_SERVER_SESSION,
} from "../shared/socketAPIRoutes";

// TODO: Document
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

    this._socketService = this.useServiceClass(
      SpeakerAppSocketAuthenticationService
    );
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
    try {
      await this._socketService.fetchSocketAPICall(
        SOCKET_API_ROUTE_INIT_VIRTUAL_SERVER_SESSION,
        params
      );

      const { realmId, channelId } = params;

      this.setState({ isHosting: true, realmId, channelId });
    } catch (err) {
      // TODO: Handle error
      throw err;
    }
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
