import UIServiceCore from "@core/classes/UIServiceCore";
import SpeakerAppSocketAuthenticationService from "./SpeakerAppSocketAuthenticationService";

export default class SpeakerAppNetworkService extends UIServiceCore {
  constructor() {
    super();

    this._socketService = this.useService(
      SpeakerAppSocketAuthenticationService
    );

    // TODO: Merge in handling for socketAPIRoutes
  }
}
