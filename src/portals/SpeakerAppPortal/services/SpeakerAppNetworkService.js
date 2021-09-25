import UIServiceCore from "@core/classes/UIServiceCore";
import SpeakerAppSocketAuthenticationService from "./SpeakerAppSocketAuthenticationService";

import { SOCKET_API_ROUTE_FETCH_NETWORKS } from "../shared/socketAPIRoutes";

export default class SpeakerAppNetworkService extends UIServiceCore {
  constructor() {
    super({
      networks: [],
    });

    this._socketService = this.useService(
      SpeakerAppSocketAuthenticationService
    );
  }

  // TODO: Document
  async fetchNetworks() {
    const networks = await this._socketService.fetchSocketAPICall(
      SOCKET_API_ROUTE_FETCH_NETWORKS
    );

    this.setState({ networks });

    return networks;
  }
}
