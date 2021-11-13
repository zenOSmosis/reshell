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

// import { getNextPeerCSSColor } from "@shared/peerCSSColorPalette";

import { CAPABILITY_MULTI_PEER_MULTIPLEXER } from "@shared/capabilities";

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

// TODO: Move this handling into VirtualServerZenRTCManager
const MAX_INSTANCES = 20;

/**
 * Represents a remote ZenRTCPeer running in a multiplexed environment.
 */
export default class VirtualServerZenRTCPeer extends ZenRTCPeer {
  // TODO: Document
  constructor({ socketIoId, ...rest }) {
    super({ socketIoId, ...rest });

    // this._cssColor = getNextPeerCSSColor();

    // TODO: Move to VirtualServerZenRTCManager
    // TODO: Rename to CAPABILITY_NETWORK_VIRTUAL_SERVER
    this.addCapability(CAPABILITY_MULTI_PEER_MULTIPLEXER);

    // TODO: Move to VirtualServerZenRTCManager
    if (VirtualServerZenRTCPeer.getInstances().length > MAX_INSTANCES) {
      this.log.warn("Too many instances");

      // TODO: Keep this like this?
      this.connect = () => null;

      // TODO: Emit through zenRTCSignalBroker that "the room is full"
      return;
    }

    (() => {
      this.on(EVT_INCOMING_MEDIA_STREAM_TRACK_ADDED, ({ mediaStreamTrack }) => {
        if (mediaStreamTrack.kind === "audio") {
          /**
           * This fixes audio being able to play on headless Chrome.
           *
           * The problem seems to be that the WebAudio graph's clock is driven
           * from its sink, so if the sink doesn't connect to anything with a
           * clock, nothing happens.
           * @see https://bugs.chromium.org/p/chromium/issues/detail?id=933677
           */
          const elMedia = document.createElement("video");
          elMedia.srcObject = new MediaStream([mediaStreamTrack]);
          // TODO: Does this need clean-up on media stream end?
        }
      });
    })();
  }

  /**
   * @return {SyncObject}
   */
  /*
  getSessionUserSyncObject() {
    // TODO: Document where this comes from

    return this._sessionUserSyncObject;
  }
  */
}
