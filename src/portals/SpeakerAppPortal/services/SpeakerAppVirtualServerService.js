import UIServiceCore from "@core/classes/UIServiceCore";
import SpeakerAppSocketAuthenticationService from "./SpeakerAppSocketAuthenticationService";

import { SOCKET_API_ROUTE_FETCH_NETWORKS } from "../shared/socketAPIRoutes";

export default class SpeakerAppVirtualServerService extends UIServiceCore {
  constructor() {
    super({
      networks: [],
    });

    this._socketService = this.useService(
      SpeakerAppSocketAuthenticationService
    );
  }

  // TODO: Document
  async createVirtualServer() {
    /*
    const networks = await this._socketService.fetchSocketAPICall(
      SOCKET_API_ROUTE_FETCH_NETWORKS
    );

    this.setState({ networks });

    return networks;
    */
  }

  // TODO: Document
  async stopVirtualServer() {}
}
