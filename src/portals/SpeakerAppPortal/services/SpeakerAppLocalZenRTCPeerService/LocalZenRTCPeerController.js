import { PhantomState, EVT_UPDATED, EVT_DESTROYED } from "phantom-core";
import SyncObject from "sync-object";
// import ZenRTCPeer from "../zenRTC/ZenRTCPeer";

export { EVT_UPDATED, EVT_DESTROYED };

// 1:1 relationship binding of controller to local ZenRTCPeer instance
// TODO: Potentially don't extend PhantomState if not using state after refactor
// TODO: Refactor into shared base class for local / virtual server usage
export default class LocalZenRTCPeerController extends PhantomState {
  // TODO: Document
  constructor({ realmID, channelID }) {
    if (!realmID || !channelID) {
      throw new Error(
        "realmID and channelID must be specified during construction"
      );
    }

    super();

    this._realmID = realmID;
    this._channelID = channelID;

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
  getRealmID() {
    return this._realmID;
  }

  // TODO: Document
  getChannelID() {
    return this._channelID;
  }

  // TODO: Pass in via constructor
  // TODO: Remove
  setSocketID(socketID) {
    this.setState({ socketID });
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

    const realmID = this._realmID;
    const channelID = this._channelID;

    const { iceServers, socketID } = this.getState();

    const writableSyncObject = this._writableSyncObject;
    const readOnlySyncObject = this._readOnlySyncObject;

    // TODO: Utilize IPCMessageBroker
    /*
    iceServers,
    socketID,
    isInitiator = false,
    shouldAutoReconnect = true, // Only if isInitiator
    offerToReceiveAudio = true,
    offerToReceiveVideo = true,
    writableSyncObject = null,
    readOnlySyncObject = null,
    preferredAudioCodecs = ["opus"],
    */
    // const zenRTCPeer = new ZenRTCPeer();

    // TODO: Remove
    console.warn("TODO: Implement connect", {
      realmID,
      channelID,
      iceServers,
      socketID,
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
