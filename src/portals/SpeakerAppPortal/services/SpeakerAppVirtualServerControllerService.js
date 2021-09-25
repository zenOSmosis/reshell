import UIServiceCore from "@core/classes/UIServiceCore";
import SpeakerAppSocketAuthenticationService from "./SpeakerAppSocketAuthenticationService";

import { SOCKET_API_ROUTE_INIT_TRANSCODER_SESSION } from "../shared/socketAPIRoutes";

// TODO: Document
export default class SpeakerAppVirtualServerControllerService extends UIServiceCore {
  constructor() {
    super({
      networks: [],
    });

    this._socketService = this.useService(
      SpeakerAppSocketAuthenticationService
    );
  }

  // TODO: Document
  async createVirtualServer(params) {
    const res = await this._socketService.fetchSocketAPICall(
      SOCKET_API_ROUTE_INIT_TRANSCODER_SESSION,
      params
    );

    // this.setState({ networks });

    // return networks;

    // TODO: Remove
    console.log({ res });
  }

  // TODO: Document
  async stopVirtualServer() {}
}
