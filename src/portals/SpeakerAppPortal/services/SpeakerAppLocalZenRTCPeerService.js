import { PhantomCollection } from "phantom-core";
import UIServiceCore, { EVT_UPDATED } from "@core/classes/UIServiceCore";
import LocalZenRTCPeer from "../zenRTC/LocalZenRTCPeer";

import SpeakerAppNetworkService from "./SpeakerAppNetworkService";
import SpeakerAppSocketAuthenticationService from "./SpeakerAppSocketAuthenticationService";

export { EVT_UPDATED };

// 1-many binding relationship of service to controllers
// TODO: Consider renaming to non-speaker-app for more dynamic usage
export default class SpeakerAppLocalZenRTCPeerService extends UIServiceCore {
  constructor(...args) {
    super(...args);

    // Goal is for local peer to be able to connect to multiple networks at the
    // same time
    this._LocalZenRTCPeerCollection = new PhantomCollection();
    this.registerShutdownHandler(() =>
      this._LocalZenRTCPeerCollection.destroy()
    );
  }

  // TODO: Document
  _getLocalZenRTCPeerInstance({ realmId, channelId }) {
    const collectionKey = this._getCollectionKey({ realmId, channelId });
    const controller =
      this._LocalZenRTCPeerCollection.getChildWithKey(collectionKey);
    return controller;
  }

  // TODO: Document
  _getCollectionKey({ realmId, channelId }) {
    return JSON.stringify({ realmId, channelId });
  }

  // TODO: Document
  _addLocalZenRTCPeerInstance(localZenRTCPeer) {
    const realmId = localZenRTCPeer.getRealmId();
    const channelId = localZenRTCPeer.getChannelId();
    const collectionKey = this._getCollectionKey({ realmId, channelId });
    this._LocalZenRTCPeerCollection.addChild(localZenRTCPeer, collectionKey);
  }

  // TODO: Document
  async connect(network) {
    const { realmId, channelId } = network;

    // Destruct previous zenRTCPeer for this network, if exists
    await this._getLocalZenRTCPeerInstance({
      realmId,
      channelId,
    })?.destroy();

    // TODO: Consider refactoring by passing in socket service; could span multiple socket connections
    const socketService = this.useServiceClass(
      SpeakerAppSocketAuthenticationService
    );

    // TODO: Consider refactoring by passing in network service; could span multiple network types
    const networkService = this.useServiceClass(SpeakerAppNetworkService);

    const iceServers = await networkService.fetchICEServers();

    const ourSocket = socketService.getSocket();
    const localZenRTCPeer = new LocalZenRTCPeer({
      network,
      ourSocket,
      iceServers,
    });

    // Adds the localZenRTCPeer to a collection; if the service is destructed,
    // the peer will automatically destruct
    this._addLocalZenRTCPeerInstance(localZenRTCPeer);

    return localZenRTCPeer.connect();
  }

  // TODO: Document
  async disconnect(network) {
    const { realmId, channelId } = network;

    // Destruct previous controller for this network, if exists, and remove it
    // from the service collection
    return this._getLocalZenRTCPeerInstance({
      realmId,
      channelId,
    })?.destroy();
  }
}
