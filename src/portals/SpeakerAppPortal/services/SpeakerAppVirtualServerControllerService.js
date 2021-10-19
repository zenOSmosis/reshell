import UIServiceCore from "@core/classes/UIServiceCore";
import SpeakerAppSocketAuthenticationService from "./SpeakerAppSocketAuthenticationService";

import {
  SOCKET_API_ROUTE_INIT_TRANSCODER_SESSION,
  SOCKET_API_ROUTE_END_TRANSCODER_SESSION,
} from "../shared/socketAPIRoutes";

// TODO: Document
export default class SpeakerAppVirtualServerControllerService extends UIServiceCore {
  constructor() {
    super({
      isHosting: false,
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
  async createVirtualServer(params) {
    try {
      await this._socketService.fetchSocketAPICall(
        SOCKET_API_ROUTE_INIT_TRANSCODER_SESSION,
        params
      );

      // TODO: Obtain this state from the BE
      this.setState({ isHosting: true });
    } catch (err) {
      // TODO: Handle error
      throw err;
    }
  }

  // TODO: Document
  async stopVirtualServer() {
    await this._socketService.fetchSocketAPICall(
      SOCKET_API_ROUTE_END_TRANSCODER_SESSION
    );

    // TODO: Obtain this state from the BE
    this.setState({ isHosting: false });
  }
}
