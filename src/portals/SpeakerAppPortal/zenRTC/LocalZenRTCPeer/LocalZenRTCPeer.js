import ZenRTCPeer, {
  EVT_UPDATED,
  EVT_CONNECTING,
  EVT_RECONNECTING,
  EVT_CONNECTED,
  EVT_DISCONNECTED,
  EVT_DESTROYED,
  EVT_OUTGOING_MEDIA_STREAM_TRACK_ADDED,
  EVT_OUTGOING_MEDIA_STREAM_TRACK_REMOVED,
  EVT_INCOMING_MEDIA_STREAM_TRACK_ADDED,
  EVT_INCOMING_MEDIA_STREAM_TRACK_REMOVED,
  EVT_DATA_RECEIVED,
  EVT_SYNC_EVT_RECEIVED,
  EVT_SDP_OFFERED,
  EVT_SDP_ANSWERED,
  EVT_ZENRTC_SIGNAL,
} from "../ZenRTCPeer";
import LocalIPCMessageBroker from "./LocalIPCMessageBroker";

export {
  EVT_UPDATED,
  EVT_CONNECTING,
  EVT_RECONNECTING,
  EVT_CONNECTED,
  EVT_DISCONNECTED,
  EVT_DESTROYED,
  EVT_OUTGOING_MEDIA_STREAM_TRACK_ADDED,
  EVT_OUTGOING_MEDIA_STREAM_TRACK_REMOVED,
  EVT_INCOMING_MEDIA_STREAM_TRACK_ADDED,
  EVT_INCOMING_MEDIA_STREAM_TRACK_REMOVED,
  EVT_DATA_RECEIVED,
  EVT_SYNC_EVT_RECEIVED,
  EVT_SDP_OFFERED,
  EVT_SDP_ANSWERED,
  EVT_ZENRTC_SIGNAL,
};

// TODO: Document
export default class LocalZenRTCPeer extends ZenRTCPeer {
  // TODO: Document
  constructor({
    network,
    ourSocket,
    iceServers,
    writableSyncObject,
    readOnlySyncObject,
    offerToReceiveAudio = true,
    offerToReceiveVideo = true,
  }) {
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

    if (!iceServers) {
      throw new ReferenceError(
        "iceServers must be specified during construction"
      );
    }

    const ipcMessageBroker = new LocalIPCMessageBroker({
      socket: ourSocket,
    });

    super({
      iceServers,
      ipcMessageBrokerId: ipcMessageBroker.getUUID(),
      realmId,
      channelId,
      writableSyncObject,
      readOnlySyncObject,
      offerToReceiveAudio,
      offerToReceiveVideo,
      isInitiator: true,
      shouldAutoReconnect: true,
    });

    this._ipcMessageBroker = ipcMessageBroker;
    this.registerShutdownHandler(() => this._ipcMessageBroker.destroy());

    this.on(EVT_SDP_OFFERED, data => {
      // TODO: Handle
      console.warn("TODO: Implement SDP offered", data);
    });

    // TODO: Listen to SDP answers from message broker and handle accordingly in ZenRTCPeer
  }
}
