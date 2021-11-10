import { PhantomCollection } from "phantom-core";
import UIServiceCore, { EVT_UPDATED } from "@core/classes/UIServiceCore";
import LocalZenRTCPeerController from "./LocalZenRTCPeerController";

import SpeakerAppNetworkService from "../SpeakerAppNetworkService";
import SpeakerAppSocketAuthenticationService from "../SpeakerAppSocketAuthenticationService";

export { EVT_UPDATED };

// 1-many binding relationship of service to controllers
// TODO: Consider renaming to non-speaker-app for more dynamic usage
export default class SpeakerAppLocalZenRTCPeerService extends UIServiceCore {
  constructor(...args) {
    super(...args);

    // Goal is for local peer to be able to connect to multiple networks at the
    // same time
    this._localZenRTCPeerControllerCollection = new PhantomCollection();
    this.registerShutdownHandler(() =>
      this._localZenRTCPeerControllerCollection.destroy()
    );
  }

  // TODO: Document
  _getLocalZenRTCPeerControllerInstance({ realmID, channelID }) {
    const collectionKey = this._getCollectionKey({ realmID, channelID });
    const controller =
      this._localZenRTCPeerControllerCollection.getChildWithKey(collectionKey);
    return controller;
  }

  // TODO: Document
  _getCollectionKey({ realmID, channelID }) {
    return JSON.stringify({ realmID, channelID });
  }

  // TODO: Document
  _addLocalZenRTCPeerControllerInstance(controller) {
    const realmID = controller.getRealmID();
    const channelID = controller.getChannelID();
    const collectionKey = this._getCollectionKey({ realmID, channelID });
    this._localZenRTCPeerControllerCollection.addChild(
      controller,
      collectionKey
    );
  }

  // TODO: Document
  async connect(network) {
    const { realmID, channelID } = network;

    // Destruct previous controller for this network, if exists
    await this._getLocalZenRTCPeerControllerInstance({
      realmID,
      channelID,
    })?.destroy();

    // TODO: Consider refactoring by passing in socket service; could span multiple socket connections
    const socketService = this.useServiceClass(
      SpeakerAppSocketAuthenticationService
    );

    // TODO: Consider refactoring by passing in network service; could span multiple network types
    const networkService = this.useServiceClass(SpeakerAppNetworkService);

    const ourSocket = socketService.getSocket();
    const zenRTCPeerController = new LocalZenRTCPeerController({
      network,
      ourSocket,
    });

    this._addLocalZenRTCPeerControllerInstance(zenRTCPeerController);

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

    return zenRTCPeerController.connect();
  }

  // TODO: Document
  async disconnect(network) {
    const { realmID, channelID } = network;

    // Destruct previous controller for this network, if exists
    return this._getLocalZenRTCPeerControllerInstance({
      realmID,
      channelID,
    })?.destroy();
  }
}
