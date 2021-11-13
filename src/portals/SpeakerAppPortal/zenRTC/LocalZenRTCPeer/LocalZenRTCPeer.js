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
import LocalZenRTCSignalBroker, {
  EVT_MESSAGE_RECEIVED,
} from "./LocalZenRTCSignalBroker";

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

    const zenRTCSignalBroker = new LocalZenRTCSignalBroker({
      socket: ourSocket,
      realmId,
      channelId,
      socketIdFrom: ourSocket.id,
      socketIdTo: transcoderSocketId,
    });

    super({
      iceServers,
      zenRTCSignalBrokerId: zenRTCSignalBroker.getUUID(),
      realmId,
      channelId,
      writableSyncObject,
      readOnlySyncObject,
      offerToReceiveAudio,
      offerToReceiveVideo,
      isInitiator: true,
      shouldAutoReconnect: true,
    });

    this._zenRTCSignalBroker = zenRTCSignalBroker;
    this.registerShutdownHandler(() => this._zenRTCSignalBroker.destroy());

    this.on(EVT_ZENRTC_SIGNAL, data => {
      this._zenRTCSignalBroker.sendMessage(data);
    });

    this._zenRTCSignalBroker.on(EVT_MESSAGE_RECEIVED, data => {
      // this.receiveZenRTCSignal(data);

      console.warn("TODO: Handle EVT_MESSAGE_RECEIVED", data);
    });
  }
}
