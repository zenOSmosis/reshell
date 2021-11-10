import UIServiceCore, {
  EVT_UPDATED,
  EVT_DESTROYED,
} from "@core/classes/UIServiceCore";
import LocalZenRTCPeerController from "./LocalZenRTCPeerController";

import SpeakerAppNetworkService from "../SpeakerAppNetworkService";
import SpeakerAppSocketAuthenticationService from "../SpeakerAppSocketAuthenticationService";

export { EVT_UPDATED };

export default class SpeakerAppLocalZenRTCPeerService extends UIServiceCore {
  constructor(...args) {
    super(...args);

    this._zenRTCPeerController = new LocalZenRTCPeerController();
    this.proxyOnce(this._zenRTCPeerController, EVT_DESTROYED, () =>
      this.destroy()
    );
    this.registerShutdownHandler(() => this._zenRTCPeerController.destroy());

    this._zenRTCPeerController.on(EVT_UPDATED, nextState => {
      // TODO: Remove
      console.log({
        nextState,
        fullState: this._zenRTCPeerController.getState(),
      });

      // TODO: Handle routing of remote states
    });
  }

  // TODO: Document
  async connect() {
    const socketService = this.useServiceClass(
      SpeakerAppSocketAuthenticationService
    );

    const networkService = this.useServiceClass(SpeakerAppNetworkService);

    const socketID = socketService.getSocketID();
    const iceServers = await networkService.fetchICEServers();

    this._zenRTCPeerController.setSocketID(socketID);
    this._zenRTCPeerController.setICEServers(iceServers);

    return this._zenRTCPeerController.connect();
  }
}
