import PhantomCore, { EVT_UPDATED, EVT_DESTROYED } from "phantom-core";
import SyncObject from "sync-object";

import LocalZenRTCPeer from "../../zenRTC/LocalZenRTCPeer";

export { EVT_UPDATED, EVT_DESTROYED };

// 1:1 relationship binding of controller to local ZenRTCPeer instance
// TODO: Potentially refactor into shared base class for local / virtual server usage
export default class LocalZenRTCPeerController extends PhantomCore {
  // TODO: Document
  constructor({ network, ourSocket }) {
    const { realmId, channelId, transcoderSocketId } = network;

    if (!realmId) {
      throw new ReferenceError("realmId must be specified during construction");
    }

    if (!channelId) {
      throw new ReferenceError(
        "channelId must be specified during construction"
      );
    }

    if (!transcoderSocketId) {
      throw new ReferenceError(
        "transcoderSocketId must be specified during construction"
      );
    }

    if (!ourSocket) {
      throw new ReferenceError(
        "ourSocket must be specified during construction"
      );
    }

    super();

    // TODO: Remove
    console.log({
      network,
      ourSocket,
    });

    this._realmId = realmId;
    this._channelId = channelId;
    this._ourSocket = ourSocket;

    // Contains our shared state
    this._writableSyncObject = new SyncObject();

    // Contains remote shared states
    this._readOnlySyncObject = new SyncObject();

    this.registerShutdownHandler(async () => {
      await Promise.all([
        () => this._writableSyncObject.destroy(),
        () => this._readOnlySyncObject.destroy(),
      ]);
    });

    this._zenRTCPeer = null;
    this._ipcMessageBroker = null;
  }

  // TODO: Document
  /*
  getRealmId() {
    return this._realmId;
  }
  */

  // TODO: Document
  /*
  getChannelId() {
    return this._channelId;
  }
  */

  // TODO: Pass in via constructor
  // TODO: Remove
  setSocketId(socketId) {
    this.setState({ socketId });
  }

  // TODO: Pass in via constructor
  // TODO: Remove
  setICEServers(iceServers) {
    this.setState({ iceServers });
  }

  // TODO: Document
  async connect() {
    // FIXME: (jh) Destroy existing or just block the attempt?
    await Promise.all([
      () => this._zenRTCPeer?.destroy(),
      () => this._ipcMessageBroker?.destroy(),
    ]);

    const realmId = this._realmId;
    const channelId = this._channelId;

    const { iceServers, socketId } = this.getState();

    const writableSyncObject = this._writableSyncObject;
    const readOnlySyncObject = this._readOnlySyncObject;

    /*
    iceServers,
    socketId,
    isInitiator = false,
    shouldAutoReconnect = true, // Only if isInitiator
    offerToReceiveAudio = true,
    offerToReceiveVideo = true,
    writableSyncObject = null,
    readOnlySyncObject = null,
    preferredAudioCodecs = ["opus"],
    */
    const localZenRTCPeer = new LocalZenRTCPeer({
      realmId,
      channelId,
      iceServers,
      socketId,
      writableSyncObject,
      readOnlySyncObject,
    });

    // TODO: Remove
    console.warn("TODO: Implement connect", {
      realmId,
      channelId,
      iceServers,
      socketId,
      writableSyncObject,
      readOnlySyncObject,
    });
  }

  // TODO: Document
  async disconnect() {
    // TODO: Remove
    console.warn("TODO: Implement disconnect");
  }

  /**
   * @return {Promise<void>}
   */
  async destroy() {
    await this.disconnect();

    return super.destroy();
  }
}
