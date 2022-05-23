import ZenRTCPeer, {
  EVT_UPDATE,
  EVT_CONNECTING,
  EVT_RECONNECTING,
  EVT_CONNECT,
  EVT_DISCONNECT,
  EVT_DESTROY,
  EVT_OUTGOING_MEDIA_STREAM_TRACK_ADD,
  EVT_OUTGOING_MEDIA_STREAM_TRACK_REMOVE,
  EVT_INCOMING_MEDIA_STREAM_TRACK_ADD,
  EVT_INCOMING_MEDIA_STREAM_TRACK_REMOVE,
  EVT_DATA,
  EVT_SYNC,
  EVT_SDP_OFFER,
  EVT_SDP_ANSWER,
  EVT_ZENRTC_SIGNAL,
} from "../ZenRTCPeer";
import LocalZenRTCSignalBroker, {
  EVT_ZENRTC_SIGNAL as EVT_SIGNAL_BROKER_ZENRTC_SIGNAL,
} from "./LocalZenRTCSignalBroker";

export {
  EVT_UPDATE,
  EVT_CONNECTING,
  EVT_RECONNECTING,
  EVT_CONNECT,
  EVT_DISCONNECT,
  EVT_DESTROY,
  EVT_OUTGOING_MEDIA_STREAM_TRACK_ADD,
  EVT_OUTGOING_MEDIA_STREAM_TRACK_REMOVE,
  EVT_INCOMING_MEDIA_STREAM_TRACK_ADD,
  EVT_INCOMING_MEDIA_STREAM_TRACK_REMOVE,
  EVT_DATA,
  EVT_SYNC,
  EVT_SDP_OFFER,
  EVT_SDP_ANSWER,
  EVT_ZENRTC_SIGNAL,
};

// TODO: Document
export default class LocalZenRTCPeer extends ZenRTCPeer {
  // TODO: Document
  constructor({
    // TODO: Pass in distinct realmId, channelId, virtualServerSocketId instead of network
    network,
    ourSocket,
    iceServers,
    inputMediaDevicesService,
    screenCapturerService,
    writableSyncObject,
    readOnlySyncObject,
    offerToReceiveAudio = true,
    offerToReceiveVideo = true,
  }) {
    const { realmId, channelId, virtualServerSocketId } = network;

    if (!realmId) {
      throw new ReferenceError("realmId must be specified during construction");
    }

    if (!channelId) {
      throw new ReferenceError(
        "channelId must be specified during construction"
      );
    }

    if (!virtualServerSocketId) {
      throw new ReferenceError(
        "virtualServerSocketId must be specified during construction"
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
      socketIdTo: virtualServerSocketId,
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

    this.registerCleanupHandler(() =>
      Promise.all([
        this._zenRTCSignalBroker &&
          this._zenRTCSignalBroker.UNSAFE_getIsDestroying() &&
          this._zenRTCSignalBroker.destroy(),
        this._localPhantomPeerSyncObject &&
          !this._localPhantomPeerSyncObject.UNSAFE_getIsDestroying() &&
          this._localPhantomPeerSyncObject.destroy(),
      ])
    );

    this.on(EVT_ZENRTC_SIGNAL, data => {
      this._zenRTCSignalBroker.signal(data);
    });

    this._zenRTCSignalBroker.on(EVT_SIGNAL_BROKER_ZENRTC_SIGNAL, signal => {
      this.receiveZenRTCSignal(signal);
    });

    this._mediaCaptureServices = [
      inputMediaDevicesService,
      screenCapturerService,
    ];

    // Handle dynamic media capture factory publishing
    (() => {
      this._mediaCaptureServices.forEach(mediaCaptureService => {
        this.proxyOn(mediaCaptureService, EVT_UPDATE, () => {
          if (this.getIsConnected()) {
            this._publishMediaCaptureFactories();
          }
        });
      });

      this.on(EVT_CONNECT, () => {
        this._publishMediaCaptureFactories();
      });
    })();
  }

  // TODO: Document
  _getMediaCaptureFactories() {
    return this._mediaCaptureServices
      .map(service => service.getCaptureFactories())
      .flat();
  }

  // TODO: Document
  _publishMediaCaptureFactories() {
    const outputMediaStreams = this._getMediaCaptureFactories().map(factory =>
      factory.getOutputMediaStream()
    );

    outputMediaStreams.forEach(mediaStream => {
      const tracks = mediaStream.getTracks();

      for (const mediaStreamTrack of tracks) {
        this.addOutgoingMediaStreamTrack(mediaStreamTrack, mediaStream);
      }
    });
  }
}
