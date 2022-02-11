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
} from "../../ZenRTCPeer";

import VirtualServerZenRTCSignalBroker from "./VirtualServerZenRTCSignalBroker";

// import { getNextPeerCSSColor } from "@shared/peerCSSColorPalette";

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

// TODO: Move this handling into VirtualServerZenRTCPeerManager?
const MAX_INSTANCES = 20;

/**
 * Virtual Server ZenRTCPeer class, a part of the ZenRTCVirtualServer tool set.
 */
export default class VirtualServerZenRTCPeer extends ZenRTCPeer {
  // TODO: Document
  constructor({
    ourSocket,
    realmId,
    channelId,
    clientSocketId,
    clientSignalBrokerId,
    ...rest
  }) {
    // ZenRTC Signal Broker
    const zenRTCSignalBroker = new VirtualServerZenRTCSignalBroker({
      socket: ourSocket,
      realmId,
      channelId,
      socketIdTo: clientSocketId,
      socketIdFrom: ourSocket.id,
      signalBrokerIdTo: clientSignalBrokerId,
    });

    super({
      zenRTCSignalBrokerId: zenRTCSignalBroker.getUUID(),
      realmId,
      channelId,
      ...rest,
    });

    this._clientSignalBrokerId = clientSignalBrokerId;

    // this._cssColor = getNextPeerCSSColor();

    // TODO: Move to VirtualServerZenRTCManager
    if (VirtualServerZenRTCPeer.getInstances().length > MAX_INSTANCES) {
      this.log.warn("Too many instances");

      // TODO: Keep this like this?
      this.connect = () => null;

      // TODO: Emit through zenRTCSignalBroker that "the room is full"
      return;
    }

    // Fix for audio transcoding in Chrome
    (() => {
      this.on(EVT_INCOMING_MEDIA_STREAM_TRACK_ADDED, ({ mediaStreamTrack }) => {
        if (mediaStreamTrack.kind === "audio") {
          /**
           * This fixes audio being able to play in [headless] Chrome, since
           * it's not playing directly out the speakers or out an audio node.
           *
           * The problem seems to be that the WebAudio graph's clock is driven
           * from its sink, so if the sink doesn't connect to anything with a
           * clock, nothing happens.
           *
           * @see https://bugs.chromium.org/p/chromium/issues/detail?id=933677
           */
          const elMedia = document.createElement("audio");
          elMedia.srcObject = new MediaStream([mediaStreamTrack]);

          // TODO: Does this need clean-up on media stream end?
        }
      });
    })();

    this._zenRTCSignalBroker = zenRTCSignalBroker;
    this.registerCleanupHandler(() => this._zenRTCSignalBroker.destroy());

    this.on(EVT_ZENRTC_SIGNAL, signal => {
      this._zenRTCSignalBroker.signal(signal);
    });

    // IMPORTANT: Socket listening for the virtual server peer signaling is
    // handled in the ZenRTCVirtualServer class, and it will call
    // receiveZenRTCSignal directly on this peer
  }

  /**
   * @return {string}
   */
  getClientSignalBrokerId() {
    return this._clientSignalBrokerId;
  }
}
