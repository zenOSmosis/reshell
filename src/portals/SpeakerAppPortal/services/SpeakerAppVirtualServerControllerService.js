import UIServiceCore from "@core/classes/UIServiceCore";
import SpeakerAppSocketAuthenticationService from "./SpeakerAppSocketAuthenticationService";

import {
  SOCKET_API_ROUTE_INIT_TRANSCODER_SESSION,
  SOCKET_API_ROUTE_END_TRANSCODER_SESSION,
} from "../shared/socketAPIRoutes";

// TODO: Document
export default class SpeakerAppVirtualServerControllerService extends UIServiceCore {
  constructor({ ...args }) {
    super({
      ...args,
    });

    // TODO: Migrate to setInitialState once available
    this.setState({
      isHosting: false,
      realmID: null,
      channelID: null,
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
    const { realmID, channelID } = this.getState();

    return {
      realmID,
      channelID,
    };
  }

  // TODO: Document
  // TODO: Wire up to transcoder
  async createVirtualServer(params) {
    try {
      await this._socketService.fetchSocketAPICall(
        SOCKET_API_ROUTE_INIT_TRANSCODER_SESSION,
        params
      );

      const { realmID, channelID } = params;

      this.setState({ isHosting: true, realmID, channelID });
    } catch (err) {
      // TODO: Handle error
      throw err;
    }
  }

  // TODO: Document
  // TODO: Wire up to transcoder
  async stopVirtualServer() {
    await this._socketService.fetchSocketAPICall(
      SOCKET_API_ROUTE_END_TRANSCODER_SESSION
    );

    this.setState({ isHosting: false, realmID: null, channelID: null });
  }
}
