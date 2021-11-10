import { PhantomCollection } from "phantom-core";
import UIServiceCore, { EVT_UPDATED } from "@core/classes/UIServiceCore";
import LocalZenRTCPeerController from "./LocalZenRTCPeerController";

import SpeakerAppNetworkService from "../SpeakerAppNetworkService";
import SpeakerAppSocketAuthenticationService from "../SpeakerAppSocketAuthenticationService";

export { EVT_UPDATED };

// TODO: Consider renaming to non-speaker-app for more dynamic usage
export default class SpeakerAppLocalZenRTCPeerService extends UIServiceCore {
  constructor(...args) {
    super(...args);

    // Goal is for local peer to be able to connect to multiple networks at the
    // same time
    this._localZenRTCPeerCollection = new PhantomCollection();
    this.registerShutdownHandler(() =>
      this._localZenRTCPeerCollection.destroy()
    );
  }

  // TODO: Document
  getCollectionKey({ realmID, channelID }) {
    return JSON.stringify({ realmID, channelID });
  }

  // TODO: Document
  async connect({ realmID, channelID }) {
    const collectionKey = this.getCollectionKey({ realmID, channelID });

    const prev = this._localZenRTCPeerCollection.getChildWithKey(collectionKey);
    if (prev) {
      await prev.destroy();
    }

    // TODO: Consider refactoring by passing in socket service; could span multiple socket connections
    const socketService = this.useServiceClass(
      SpeakerAppSocketAuthenticationService
    );

    // TODO: Consider refactoring by passing in network service; could span multiple network types
    const networkService = this.useServiceClass(SpeakerAppNetworkService);

    const zenRTCPeerController = new LocalZenRTCPeerController({
      realmID,
      channelID,
    });

    this._localZenRTCPeerCollection.addChild(
      zenRTCPeerController,
      collectionKey
    );

    zenRTCPeerController.on(EVT_UPDATED, nextState => {
      // TODO: Remove
      console.log({
        nextState,
        fullState: zenRTCPeerController.getState(),
      });

      // TODO: Handle routing of remote states
    });

    const socketID = socketService.getSocketID();
    const iceServers = await networkService.fetchICEServers();

    zenRTCPeerController.setSocketID(socketID);
    zenRTCPeerController.setICEServers(iceServers);

    return zenRTCPeerController.connect({ realmID, channelID });
  }

  // TODO: Document
  async disconnect({ realmID, channelID }) {
    const collectionKey = this.getCollectionKey({ realmID, channelID });

    const zenRTCPeerController =
      this._localZenRTCPeerCollection.getChildWithKey(collectionKey);

    if (zenRTCPeerController) {
      return zenRTCPeerController.destroy();
    }
  }
}
