import { PhantomState, EVT_UPDATED, EVT_DESTROYED } from "phantom-core";
import SyncObject from "sync-object";
// import ZenRTCPeer from "../zenRTC/ZenRTCPeer";

export { EVT_UPDATED, EVT_DESTROYED };

// TODO: Create base class for local / virtual server usage
export default class LocalZenRTCPeerController extends PhantomState {
  constructor() {
    super();

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
  setSocketID(socketID) {
    this.setState({ socketID });
  }

  // TODO: Document
  setICEServers(iceServers) {
    this.setState({ iceServers });
  }

  async connect() {
    // FIXME: (jh) Destroy existing or just block the attempt?
    await Promise.all([
      () => this._zenRTCPeer?.destroy(),
      () => this._ipcMessageBroker?.destroy(),
    ]);

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
      iceServers,
      socketID,
      writableSyncObject,
      readOnlySyncObject,
    });
  }
}
