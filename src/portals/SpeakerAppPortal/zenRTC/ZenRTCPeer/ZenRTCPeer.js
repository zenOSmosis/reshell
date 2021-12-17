import PhantomCore, {
  EVT_UPDATED,
  EVT_DESTROYED,
  getUnixTime,
} from "phantom-core";
import WebRTCPeer from "webrtc-peer";
import SDPAdapter from "./utils/sdp-adapter";

// TODO: Import utils/getWebRTCSignalStrength

import sleep from "@portals/SpeakerAppPortal/shared/sleep";

import {
  SYNC_EVT_PING,
  SYNC_EVT_PONG,
  SYNC_EVT_BYE,
  SYNC_EVT_KICK,
  SYNC_EVT_TRACK_REMOVED,
  SYNC_EVT_DEBUG,
} from "@portals/SpeakerAppPortal/shared/syncEvents";

import HeartbeatModule from "./modules/ZenRTCPeer.HeartbeatModule";
import SyncObjectLinkerModule from "./modules/ZenRTCPeer.SyncObjectLinkerModule";
import DataChannelManagerModule from "./modules/ZenRTCPeer.DataChannelManagerModule";
import SyncEventDataChannelModule from "./modules/ZenRTCPeer.SyncEventDataChannelModule";
import MediaStreamManagerModule, {
  EVT_INCOMING_MEDIA_STREAM_TRACK_ADDED,
  EVT_INCOMING_MEDIA_STREAM_TRACK_REMOVED,
  EVT_OUTGOING_MEDIA_STREAM_TRACK_ADDED,
  EVT_OUTGOING_MEDIA_STREAM_TRACK_REMOVED,
} from "./modules/ZenRTCPeer.MediaStreamManagerModule";

// ZenRTCPeer instances running on this thread, using zenRTCSignalBrokerId as reference
// keys
const _instances = {};

export { EVT_DESTROYED, EVT_UPDATED };
export const EVT_CONNECTING = "connecting";
export const EVT_RECONNECTING = "reconnecting";
export const EVT_CONNECTED = "connected";
export const EVT_DISCONNECTED = "disconnected";

// export const EVT_SIMPLE_PEER_INSTANTIATED = "simple-peer-instantiated";

// TODO: Document
//
// Is emit when there is an outgoing ZenRTC signal
export const EVT_ZENRTC_SIGNAL = "zenrtc-signal";

export {
  EVT_INCOMING_MEDIA_STREAM_TRACK_ADDED,
  EVT_INCOMING_MEDIA_STREAM_TRACK_REMOVED,
  EVT_OUTGOING_MEDIA_STREAM_TRACK_ADDED,
  EVT_OUTGOING_MEDIA_STREAM_TRACK_REMOVED,
};

// Emits, with the received data, once data has been received
// TODO: Rename to EVT_DATA
export const EVT_DATA_RECEIVED = "data";

export const EVT_SDP_OFFERED = "sdp-offered";
export const EVT_SDP_ANSWERED = "sdp-answered";

// TODO: Document type {eventName, eventData}
// TODO: Rename to EVT_SYNC
export const EVT_SYNC_EVT_RECEIVED = "sync-event";

// Internal event for pinging (in conjunction w/ SYNC_EVT_PONG)
const EVT_PONG = "pong";

/**
 * TODO: Handle possible WebRTCPeer error codes:
 *
 * - ERR_WEBRTC_SUPPORT
 * - ERR_CREATE_OFFER
 * - ERR_CREATE_ANSWER
 * - ERR_SET_LOCAL_DESCRIPTION
 * - ERR_SET_REMOTE_DESCRIPTION
 * - ERR_ADD_ICE_CANDIDATE
 * - ERR_ICE_CONNECTION_FAILURE
 * - ERR_SIGNALING
 * - ERR_DATA_CHANNEL
 * - ERR_CONNECTION_FAILURE
 */

/**
 * The fundamental P2P / WebRTC peer connection, regardless if the other peer
 * is an SFU / MFU or a client device.
 *
 * TODO: Provide additional layer to separate WebRTCPeer directly from this
 * class so we can use it with other connection mechanisms.
 */
export default class ZenRTCPeer extends PhantomCore {
  /**
   * Retrieves whether or not WebRTC is supported.
   *
   * @return {boolean}
   */
  static getIsWebRTCSupported() {
    // @see https://github.com/feross/simple-peer#peerwebrtc_support
    return WebRTCPeer.WEBRTC_SUPPORT;
  }

  /**
   * TODO: Rename to getThreadInstances?
   *
   * Retrieves all ZenRTCPeer instances in this thread.
   *
   * @return {ZenRTCPeer[]}
   */
  static getInstances() {
    return Object.values(_instances);
  }

  // TODO: Sync these comments with the actual properties
  /**
   * @param {string} zenRTCSignalBrokerId Used primarily for peer distinction // TODO: Rename
   * @param {boolean} isInitiator? [default=false] Whether or not this peer is
   * the origination peer in the connection signaling.
   * @param {boolean} shouldAutoReconnect? [default=true] Has no effect if is
   * not initiator.
   * @param {boolean} offerToReceiveAudio? [default=true]
   * @param {boolean} offerToReceiveVideo? [default=true]
   * @param {string} preferredAudioCodecs? [default=["opus"]]
   */
  constructor({
    zenRTCSignalBrokerId,
    realmId,
    channelId,
    iceServers,
    isInitiator = false,
    shouldAutoReconnect = true, // Only if isInitiator
    offerToReceiveAudio = true,
    offerToReceiveVideo = true,
    writableSyncObject = null,
    readOnlySyncObject = null,
    preferredAudioCodecs = ["opus"],
  }) {
    if (!zenRTCSignalBrokerId) {
      throw new ReferenceError("No zenRTCSignalBrokerId present");
    }

    if (_instances[zenRTCSignalBrokerId]) {
      throw new ReferenceError(
        `CPU thread already contains ZenRTCPeer instance with zenRTCSignalBrokerId ${zenRTCSignalBrokerId}`
      );
    }

    if (!iceServers) {
      throw new ReferenceError("No ICE servers present");
    }

    super();

    // IMPORTANT: This may need to be changed accordingly in order to handle more peers
    // TODO: Move this to transcoder only
    this.setMaxListeners(100);

    this._iceServers = iceServers;
    this._realmId = realmId;
    this._channelId = channelId;

    this.preferredAudioCodecs = preferredAudioCodecs;

    _instances[zenRTCSignalBrokerId] = this;

    this.log.debug(
      `Constructing new ${
        this.constructor.name
      } with zenRTCSignalBrokerId "${zenRTCSignalBrokerId}" as "${
        isInitiator ? "initiator" : "guest"
      }"`
    );

    this._zenRTCSignalBrokerId = zenRTCSignalBrokerId;
    this._isInitiator = isInitiator;
    this._shouldAutoReconnect = shouldAutoReconnect;

    this._offerToReceiveAudio = offerToReceiveAudio;
    this._offerToReceiveVideo = offerToReceiveVideo;

    this._isConnected = false;

    this._sdpOffer = null;
    this._sdpAnswer = null;

    this._connectionStartTime = 0;

    this._latency = 0;

    // Handle management of connectionStartTime
    (() => {
      this.on(EVT_CONNECTED, () => {
        // TODO: Remove
        this.log.debug(`${this.getClassName()} connected`);

        this._connectionStartTime = getUnixTime();
      });

      this.on(EVT_DISCONNECTED, () => {
        // TODO: Remove
        this.log.debug(`${this.getClassName()} disconnected`);

        this._connectionStartTime = 0;
      });
    })();

    /** @see https://github.com/feross/simple-peer */
    this._webrtcPeer = null;

    // Init modules
    (() => {
      this._heartbeatModule = new HeartbeatModule(this);

      this._syncObjectLinkerModule = new SyncObjectLinkerModule(
        this,
        writableSyncObject,
        readOnlySyncObject
      );

      this._dataChannelManagerModule = new DataChannelManagerModule(this);

      this._syncEventDataChannelModule = new SyncEventDataChannelModule(this);

      // Media manager module
      (() => {
        this._mediaStreamManagerModule = new MediaStreamManagerModule(this);

        this.proxyOn(
          this._mediaStreamManagerModule,
          EVT_INCOMING_MEDIA_STREAM_TRACK_ADDED,
          data => {
            this.emit(EVT_INCOMING_MEDIA_STREAM_TRACK_ADDED, data);

            this.emit(EVT_UPDATED);
          }
        );
        this.proxyOn(
          this._mediaStreamManagerModule,
          EVT_INCOMING_MEDIA_STREAM_TRACK_REMOVED,
          data => {
            this.emit(EVT_INCOMING_MEDIA_STREAM_TRACK_REMOVED, data);

            this.emit(EVT_UPDATED);
          }
        );
        this.proxyOn(
          this._mediaStreamManagerModule,
          EVT_OUTGOING_MEDIA_STREAM_TRACK_ADDED,
          data => {
            const { mediaStreamTrack, mediaStream } = data;

            try {
              this._webrtcPeer.addTrack(mediaStreamTrack, mediaStream);
            } catch (err) {
              this.log.error(err);
            }

            this.emit(EVT_OUTGOING_MEDIA_STREAM_TRACK_ADDED, data);

            this.emit(EVT_UPDATED);
          }
        );
        this.proxyOn(
          this._mediaStreamManagerModule,
          EVT_OUTGOING_MEDIA_STREAM_TRACK_REMOVED,
          async data => {
            const { mediaStreamTrack, mediaStream } = data;

            try {
              await this._webrtcPeer.removeTrack(mediaStreamTrack, mediaStream);
            } catch (err) {
              this.log.error(err);
            }

            // Signal to remote that we've removed the track
            //
            // NOTE (jh): This is a workaround since WebRTCPeer does not emit track
            // removed events directly
            this.emitSyncEvent(SYNC_EVT_TRACK_REMOVED, {
              msid: mediaStream.id,
              kind: mediaStreamTrack.kind,
            });

            this.emit(EVT_OUTGOING_MEDIA_STREAM_TRACK_REMOVED, data);

            this.emit(EVT_UPDATED);
          }
        );
      })();
    })();

    this._reconnectArgs = [];
  }

  /**
   * Utilized for peer identification.
   *
   * @return {string}
   */
  getSignalBrokerId() {
    return this._zenRTCSignalBrokerId;
  }

  /**
   * @return {string}
   */
  getRealmId() {
    return this._realmId;
  }

  /**
   * @return {string}
   */
  getChannelId() {
    return this._channelId;
  }

  /**
   * @param {string} dataChannelName
   * @return {DataChannel}
   */
  createDataChannel(dataChannelName) {
    return this._dataChannelManagerModule.getOrCreateDataChannel(
      dataChannelName
    );
  }

  /**
   * @param {string} sdp
   * @return {string}
   */
  _handleSdpOfferTransform(sdp) {
    if (sdp) {
      sdp = SDPAdapter.setPreferredAudioCodecs(sdp, this._preferredAudioCodecs);
    }

    return sdp;
  }

  /**
   * The current SDP offer.
   *
   * @return {string}
   */
  getSdpOffer() {
    return this._sdpOffer;
  }

  /**
   * @param {string} sdp
   * @return {string}
   */
  _handleSdpAnswerTransform(sdp) {
    if (sdp) {
      sdp = SDPAdapter.setPreferredAudioCodecs(sdp, this._preferredAudioCodecs);
    }

    return sdp;
  }

  /**
   * The current SDP answer.
   *
   * @return {string}
   */
  getSdpAnswer() {
    return this._sdpAnswer;
  }

  /**
   * @return {SyncObject}
   */
  getReadOnlySyncObject() {
    return this._syncObjectLinkerModule.getReadOnlySyncObject();
  }

  /**
   * @return {SyncObject}
   */
  getWritableSyncObject() {
    return this._syncObjectLinkerModule.getWritableSyncObject();
  }

  /**
   * Send kick signal to other peer.
   *
   * It is up to the other peer to decide what to do w/ the signal, though we
   * can destroy the connection and anything we know of the other peer here.
   */
  async kick() {
    this.emitSyncEvent(SYNC_EVT_KICK);

    // Pause for message to be delivered
    await new Promise(resolve => setTimeout(resolve, 100));

    this.destroy();
  }

  /**
   * @return {ZenRTCPeer[]}
   */
  getOtherThreadInstances() {
    return ZenRTCPeer.getOtherInstances(this);
  }

  /**=
   * @param {number} timeout? [optional; default = 10000] The number of
   * milliseconds to allow the ping request to continue before giving up.
   * @return {Promise<number>} A float value representing the latency, in
   * milliseconds.
   */
  ping(timeout = 10000) {
    return new Promise((resolve, reject) => {
      const prev = window.performance.now();

      this.emitSyncEvent(SYNC_EVT_PING);

      const timeoutReject = setTimeout(reject, timeout);

      this.once(EVT_PONG, () => {
        const latency = window.performance.now() - prev;

        clearTimeout(timeoutReject);

        this._latency = latency;

        resolve(latency);
      });
    });
  }

  /**
   * Retrieves the cached latency observed from the last ping call.
   *
   * If the peer is not connected, it will return void.
   *
   * @return {number | void} Number of milliseconds for last completed ping /
   * pong cycle.
   */
  getLatency() {
    return this._isConnected ? this._latency : undefined;
  }

  /**
   * @return {boolean} Whether or not this peer is the WebRTC initiator.
   */
  getIsInitiator() {
    return this._isInitiator;
  }

  // TODO: Accept optional callback
  /**
   * Resolves once connected.
   *
   * Note: This was intentionally different than the onceReady() base class
   * method because, potentially, the class instance could be used for that
   * purpose as well.
   *
   * @return {Promise<void>}
   */
  async onceConnected() {
    if (this._isConnected) {
      return;
    } else {
      await new Promise(resolve => this.once(EVT_CONNECTED, resolve));
    }
  }

  /**
   * Sets whether or not this peer wishes to receive audio.
   *
   * @param {boolean} offerToReceiveAudio
   */
  setOfferToReceiveAudio(offerToReceiveAudio) {
    this._offerToReceiveAudio = offerToReceiveAudio;
  }

  /**
   * Sets whether or not this peer wishes to receive video.
   *
   * @param {boolean} offerToReceiveVideo
   */
  setOfferToReceiveVideo(offerToReceiveVideo) {
    this._offerToReceiveVideo = offerToReceiveVideo;
  }

  /**
   * TODO: Make private; or auto-(re)connect?
   *
   * @param {MediaStream} outgoingMediaStream?
   * @return {Promise<void>}
   */
  async connect(outgoingMediaStream = new MediaStream()) {
    this._reconnectArgs = [outgoingMediaStream];

    if (this._isDestroyed) {
      // FIXME: This should probably throw, however on Firefox if clicking
      // connect button multiple times while mic prompt is active, it will
      // trigger this
      this.log.warn(
        `Cannot start a new ${this.getClassName()} connection after the class instance has been destroyed`
      );
      return;
    }

    if (this._webrtcPeer) {
      this.log.warn(
        `${this.getClassName()} is already connected or connecting`
      );
      return;
    } else {
      this._webrtcPeer = null;

      if (outgoingMediaStream) {
        // Sync WebRTCPeer outgoing tracks to class outgoing tracks, once
        // connected
        this.once(EVT_CONNECTED, async () => {
          const mediaStreamTracks = outgoingMediaStream.getTracks();

          for (const mediaStreamTrack of mediaStreamTracks) {
            this.addOutgoingMediaStreamTrack(
              mediaStreamTrack,
              outgoingMediaStream
            );
          }
        });
      }

      const simplePeerOptions = {
        initiator: this._isInitiator,

        // Set to false to disable trickle ICE and get a single 'signal' event (slower)
        // FIXME: (jh) Make this configurable
        trickle: true,

        // @see https://developer.mozilla.org/en-US/docs/Web/API/RTCConfiguration/iceTransportPolicy#value
        // iceTransportPolicy: "relay",

        stream: outgoingMediaStream,

        /**
         * TODO: offerOptions voiceActivityDetection false (better music quality).
         *
         * @see https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/createOffer
         * @see https://github.com/feross/simple-peer#peerdestroyerr
         */
        offerOptions: {
          offerToReceiveAudio: this._offerToReceiveAudio,
          offerToReceiveVideo: this._offerToReceiveVideo,

          /** Offer better music quality if false */
          voiceActivityDetection: false,
        },

        config: {
          iceServers: this._iceServers,
        },

        sdpTransform: sdp => {
          // Offer, to other peer
          sdp = this._handleSdpOfferTransform(sdp);

          // TODO: Remove
          /*
          this.log.debug({
            offer: sdpTransform.parse(sdp),
            zenRTCSignalBrokerId: this.getSignalBrokerId(),
          });
          */

          this._sdpOffer = sdp;
          this.emit(EVT_SDP_OFFERED, sdp);

          return sdp;
        },

        objectMode: true,
      };

      this.log.debug(
        `${this.getClassName()} is instantiating as ${
          this._isInitiator ? "initiator" : "guest"
        }`
      );

      /** @see https://github.com/feross/simple-peer */
      this._webrtcPeer = new WebRTCPeer(simplePeerOptions);

      this.emit(EVT_CONNECTING);

      // TODO: Build out
      // TODO: Send up ipcMessageBroker
      // TODO: Use event constant
      /** @see https://github.com/feross/simple-peer#error-codes */
      this._webrtcPeer.on("error", async err => {
        // TODO: Debug error and determine if we need to try to reconnect
        this.log.warn("Caught WebRTCPeer error", err);

        /*
        if (this._isInitiator && this._shouldAutoReconnect) {
          this._reconnect();
        }
        */
      });

      // Handle outgoing WebRTC signaling
      // TODO: Use event constant
      this._webrtcPeer.on("signal", data => this.sendZenRTCSignal(data));

      // Handle WebRTC connect
      // TODO: Use event constant
      this._webrtcPeer.on("connect", () => {
        this._isConnected = true;
        this._connectTime = getUnixTime();

        this.emit(EVT_CONNECTED);
      });

      // Handle WebRTC disconnect
      // TODO: Use event constant
      this._webrtcPeer.on("close", async () => {
        this._isConnected = false;

        // Fix issue where reconnecting streams causes tracks to build up
        // this._outgoingMediaStreamCollection.destroyAllChildren();
        // this._incomingMediaStreamCollection.destroyAllChildren();

        this.emit(EVT_DISCONNECTED);

        // Provide automated re-connect mechanism, if this is the initiator and
        // we've closed before we expected
        if (this._isInitiator && this._shouldAutoReconnect) {
          return this._reconnect();
        }

        this.log.debug("webrtc-peer disconnected");

        this.destroy();
      });

      // TODO: Remove; For automated reconnection testing
      // setTimeout(() => this._webrtcPeer && this._webrtcPeer.destroy(), 5000);

      // Handle incoming MediaStreamTrack from remote peer
      // TODO: Use event constant
      this._webrtcPeer.on("track", (mediaStreamTrack, mediaStream) => {
        // NOTE (jh): This timeout seems to improve an issue w/ iOS 14
        // sometimes disconnecting when tracks are added
        setTimeout(() => {
          this._mediaStreamManagerModule.addIncomingMediaStreamTrack(
            mediaStreamTrack,
            mediaStream
          );
        }, 500);
      });

      // TODO: Use event constant
      this._webrtcPeer.on("data", data => {
        this.emit(EVT_DATA_RECEIVED, data);
      });

      // this.emit(EVT_SIMPLE_PEER_INSTANTIATED);
    }
  }

  /**
   * Utilized with connect for auto-reconnect handling.
   *
   * TODO: Clean up
   *
   * @return {Promise<void>}
   */
  async _reconnect() {
    // Sleep for a second before trying to reconnect
    await sleep(1000);

    // NOTE (jh): It is intentional that this check comes after the previous
    // sleep promise
    if (!this._isDestroyed) {
      this._webrtcPeer = null;

      this.log.debug("Trying to reconnect");

      const ret = this.connect(...this._reconnectArgs);

      this.emit(EVT_RECONNECTING);

      return ret;
    }
  }

  /**
   * @return {boolean}
   */
  getIsConnected() {
    return this._isConnected;
  }

  /**
   * Called internally when a WebRTC signal is to be emit to the other peer.
   *
   * @param {Object} data // TODO: Document; connected directly to WebRTCPeer on.signal
   */
  async sendZenRTCSignal(data) {
    this.emit(EVT_ZENRTC_SIGNAL, {
      signal: data,
    });
  }

  /**
   * @param {Object} params TODO: Document
   */
  async receiveZenRTCSignal({ signal }) {
    if (this._webrtcPeer) {
      signal.sdp = this._handleSdpAnswerTransform(signal.sdp);

      try {
        this._webrtcPeer.signal(signal);
      } catch (err) {
        this.log.warn("Caught", err);
      }

      this._sdpAnswer = signal.sdp;
      this.emit(EVT_SDP_ANSWERED, signal.sdp);
    } else {
      throw new Error(
        `No WebRTCPeer in ${this.constructor.name} with zenRTCSignalBrokerId "${this._zenRTCSignalBrokerId}"`
      );
    }
  }

  /**
   * @return {MediaStream[]}
   */
  getIncomingMediaStreams() {
    return this._mediaStreamManagerModule.getIncomingMediaStreams();
  }

  /**
   * IMPORTANT: When trying to associate a track with a multiplexed remote
   * peer, it must be matched by the enclosing MediaStream ID (i.e. obtain from
   * getIncomingMediaStreams()).
   *
   * @return {MediaStreamTrack[]}
   */
  getIncomingMediaStreamTracks() {
    return this._mediaStreamManagerModule.getIncomingMediaStreamTracks();
  }

  // TODO: Remove
  /**
   * Internally registers incoming MediaStreamTrack and associates it with the
   * given MediaStream.
   *
   * @param {MediaStreamTrack} mediaStreamTrack
   * @param {MediaStream} mediaStream
   */
  OLD_addIncomingMediaStreamTrack(mediaStreamTrack, mediaStream) {
    // TODO: Verify mediaStream doesn't have more than one of the given track type, already (if it does, replace it?)

    // If MediaStream is not already added to list of incoming media streams, add it
    this._mediaStreamManagerModule.addIncomingMediaStreamTrack(
      mediaStreamTrack,
      mediaStream
    );

    // WebRTCPeer should have already added this to the stream
    // mediaStream.addTrack(mediaStreamTrack);

    // TODO: Refactor; listen to collection itself before emitting this event
    /*
    this.emit(EVT_INCOMING_MEDIA_STREAM_TRACK_ADDED, {
      mediaStreamTrack,
      mediaStream,
    });
    */

    // this.emit(EVT_UPDATED);
  }

  // TODO: Remove
  /**
   * Internally de-registers incoming MediaStreamTrack and disassociates it
   * from the given MediaStream.
   *
   * @param {MediaStreamTrack} mediaStreamTrack
   * @param {MediaStream} mediaStream
   */
  OLD_removeIncomingMediaStreamTrack(mediaStreamTrack, mediaStream) {
    this._mediaStreamManagerModule.removeIncomingMediaStreamTrack(
      mediaStreamTrack,
      mediaStream
    );

    // TODO: Refactor; listen to collection itself before emitting this event
    /*
    this.emit(EVT_INCOMING_MEDIA_STREAM_TRACK_REMOVED, {
      mediaStreamTrack,
      mediaStream,
    });
    */

    // this.emit(EVT_UPDATED);
  }

  /**
   * @return {MediaStream[]}
   */
  getOutgoingMediaStreams() {
    return this._mediaStreamManagerModule.getOutgoingMediaStreams();
  }

  /**
   * @return {MediaStreamTrack[]}
   */
  getOutgoingMediaStreamTracks() {
    return this._mediaStreamManagerModule.getOutgoingMediaStreamTracks();
  }

  /**
   * @param {MediaStreamTrack} mediaStreamTrack
   * @param {MediaStream} mediaStream
   * @return {void}
   */
  addOutgoingMediaStreamTrack(mediaStreamTrack, mediaStream) {
    // FIXME: (jh) Firefox 86 doesn't listen to "ended" event, and the
    // functionality has to be monkeypatched into the onended handler. Note
    // that this still works in conjunction with
    // track.dispatchEvent(new Event("ended")).
    //
    // FIXME: (jh) media-stream-track-controller has some of this handling
    // built in, and it might be better to use it instead.
    const oEnded = mediaStreamTrack.onended;
    mediaStreamTrack.onended = (...args) => {
      if (typeof oEnded === "function") {
        oEnded(...args);
      }

      this.log.debug(
        "Automatically removing ended media stream track",
        mediaStreamTrack
      );

      this.removeOutgoingMediaStreamTrack(mediaStreamTrack, mediaStream);
    };

    return this._mediaStreamManagerModule.addOutgoingMediaStreamTrack(
      mediaStreamTrack,
      mediaStream
    );
  }

  // TODO: Remove
  /**
   * i.e. publish
   *
   * TODO: Don't add track if peer is not accepting track of type
   *
   * @param {MediaStreamTrack} mediaStreamTrack
   * @param {MediaStream} mediaStream
   * @return {void}
   */
  async OLD_addOutgoingMediaStreamTrack(mediaStreamTrack, mediaStream) {
    if (!(mediaStreamTrack instanceof MediaStreamTrack)) {
      throw new TypeError("mediaStreamTrack is not a MediaStreamTrack type");
    }

    if (!(mediaStream instanceof MediaStream)) {
      throw new TypeError("mediaStream is not a MediaStream type");
    }

    // TODO: Verify mediaStream doesn't have more than one of the given track type, already (if it does, replace it?)

    if (!this._webrtcPeer) {
      this.log.warn("WebRTCPeer is not open");
      return;
    }

    // TODO: Remove
    console.log("adding outgoing media stream track", {
      mediaStreamTrack,
      mediaStream,
    });

    try {
      // TODO: Should the mediaStream.addTrack and addMediaStreamToList calls
      // happen after this._webrtcPeer.addTrack happens, instead?  The peer
      // will raise an error when trying to add a duplicate track to a stream,
      // in which case that error could make the other states out of sync

      this._mediaStreamManagerModule.addOutgoingMediaStreamTrack(
        mediaStreamTrack,
        mediaStream
      );

      // TODO: Refactor to use manager's EVT_OUTGOING_MEDIA_STREAM_TRACK_ADDED caller
      this._webrtcPeer.addTrack(mediaStreamTrack, mediaStream);

      // TODO: Refactor
      // FIXME: (jh) Firefox 86 doesn't listen to "ended" event, and the
      // functionality has to be monkeypatched into the onended handler. Note
      // that this still works in conjunction with
      // track.dispatchEvent(new Event("ended")).
      //
      // FIXME: (jh) media-stream-track-controller has some of this handling
      // built in, and it might be better to use it instead.
      const oEnded = mediaStreamTrack.onended;
      mediaStreamTrack.onended = (...args) => {
        if (typeof oEnded === "function") {
          oEnded(...args);
        }

        this.log.debug(
          "Automatically removing ended media stream track",
          mediaStreamTrack
        );

        this.removeOutgoingMediaStreamTrack(mediaStreamTrack, mediaStream);
      };

      // TODO: Refactor; listen to collection itself before emitting this event
      /*
      this.emit(EVT_OUTGOING_MEDIA_STREAM_TRACK_ADDED, {
        mediaStreamTrack,
        mediaStream,
      });
      */

      /*
      this.emit(EVT_UPDATED);
      */
    } catch (err) {
      this.log.warn("Caught error in addOutgoingMediaStreamTrack", err);
    }
  }

  /**
   * @param {MediaStreamTrack} mediaStreamTrack
   * @param {MediaStream} mediaStream
   * @return {void}
   */
  removeOutgoingMediaStreamTrack(mediaStreamTrack, mediaStream) {
    return this._mediaStreamManagerModule.removeOutgoingMediaStreamTrack(
      mediaStreamTrack,
      mediaStream
    );
  }

  // TODO: Remove
  /**
   * i.e. unpublish
   *
   * @param {MediaStreamTrack} mediaStreamTrack
   * @param {MediaStream} mediaStream
   * @return {Promise<void>}
   */
  async OLD_removeOutgoingMediaStreamTrack(mediaStreamTrack, mediaStream) {
    if (!this._webrtcPeer) {
      this.log.warn("WebRTCPeer is not open");
      return;
    }

    try {
      // Unpublish track
      await this._webrtcPeer.removeTrack(mediaStreamTrack, mediaStream);
    } catch (err) {
      this.log.warn("Caught", err);
    }

    // Remove local representation of stream
    this._mediaStreamManagerModule.removeOutgoingMediaStreamTrack(
      mediaStreamTrack,
      mediaStream
    );

    // TODO: Refactor; listen to collection itself before emitting this event
    /*
    this.emit(EVT_OUTGOING_MEDIA_STREAM_TRACK_REMOVED, {
      mediaStreamTrack,
      mediaStream,
    });
    */

    // TODO: Refactor; listen to collection itself before emitting this event
    // this.emit(EVT_UPDATED);

    // TODO: Refactor...
    // Signal to remote that we've removed the track
    //
    // NOTE (jh): This is a workaround since WebRTCPeer does not emit track
    // removed events directly
    this.emitSyncEvent(SYNC_EVT_TRACK_REMOVED, {
      msid: mediaStream.id,
      kind: mediaStreamTrack.kind,
    });
  }

  // TODO: Reimplement?
  /**
   * Performs a reverse-lookup of MediaStream from given MediaStreamTrack.
   *
   * NOTE: If the same MediaStreamTrack were to be encased in more than one
   * MediaStream, only the first MediaStream will be returned.
   *
   * @param {MediaStreamTrack} mediaStreamTrack
   * @return {MediaStream}
   */
  /*
  getTrackMediaStream(mediaStreamTrack) {
    return [
      this._outgoingMediaStreamCollection,
      this._incomingMediaStreamCollection,
    ].find(collection => collection.getTrackMediaStream(mediaStreamTrack));
  }
  */

  // TODO: Document
  //
  // Helper / Convenience method
  //
  // TODO: Enable support to remotely publish/unpublish tracks based on what's
  // added to / removed from this stream
  /*
  async publishMediaStream(mediaStream) {
    const tracks = mediaStream.getTracks();

    for (const track of tracks) {
      this.addOutgoingMediaStreamTrack(track, mediaStream);
    }
  }
  */

  /**
   * Helper / Convenience method
   *
   * @return {MediaStream}
   */
  /*
  getPublishedMediaStreams() {
    return this.getOutgoingMediaStreams();
  }
  */

  // TODO: Document
  //
  // Helper / Convenience method
  /*
  async unpublishMediaStream(mediaStream) {
    const tracks = mediaStream.getTracks();

    for (const track of tracks) {
      this.removeOutgoingMediaStreamTrack(track, mediaStream);
    }
  }
  */

  /**
   * Sends data over the WebRTC data channel.
   *
   * Note, this uses UDP and the transmission is not guaranteed.
   *
   * @param {any} data
   * @return {boolean} Whether or not the call to send the data succeeded (does
   * not indicate successful receipt of data on other peer).
   */
  async send(data) {
    if (this._isDestroyed) {
      return false;
    }

    // Await connection before trying to send data (buffer until connect)
    await this.onceConnected();

    if (
      this._isConnected &&
      this._webrtcPeer &&
      // WebRTCPeer (simple-peer) utilizes a single data channel
      //
      // Also
      // @see https://github.com/feross/simple-peer/issues/480
      // InvalidStateError: RTCDataChannel.readyState is not 'open'
      // FIXME: (jh) Fix issue in WebRTCPeer?
      this._webrtcPeer._channel &&
      this._webrtcPeer._channel.readyState === "open"
    ) {
      // Serialize objects for transport
      if (typeof data === "object") {
        data = JSON.stringify(data);
      }

      try {
        this._webrtcPeer.send(data);

        return true;
      } catch (err) {
        this.log.warn("Caught", err);
      }
    } else {
      this.log.warn(
        "Data channel is not open.  Retrying data send after open."
      );

      // Allow a grace period before trying to retry data send
      await sleep(2000);

      // Retry data send
      this.send(data);
    }

    return false;
  }

  /**
   * Sends sync event data to other peer.
   *
   * NOTE: Sync event constants are defined in shared/syncEvents.js.
   *
   * @param {string} eventName
   * @param {any} eventData? [default = null]
   */
  emitSyncEvent(eventName, eventData = null) {
    this._syncEventDataChannelModule.emitSyncEvent(eventName, eventData);
  }

  /**
   * Receives sync event from other peer.
   *
   * This is internally called via the SyncEventDataChannelModule.
   *
   * @param {string} eventName
   * @param {any} eventData
   */
  receiveSyncEvent(eventName, eventData) {
    switch (eventName) {
      case SYNC_EVT_PING:
        // Emit to other peer we have a ping
        this.emitSyncEvent(SYNC_EVT_PONG);
        break;

      case SYNC_EVT_PONG:
        // Emit to internal ping() handler we have a pong from other peer
        this.emit(EVT_PONG);
        break;

      case SYNC_EVT_BYE:
        this.destroy();
        break;

      // Internal event to zenRTCPeer
      case SYNC_EVT_TRACK_REMOVED:
        (() => {
          // Remove "tracksOfKind" and remove all tracks with this media stream
          // FIXME: (jh) Try to remove only the relevant track

          // msid = media stream id
          // kind = "audio" | "video"
          const { msid, kind } = eventData;

          // TODO: Remove
          console.log("SYNC_EVT_TRACK_REMOVED", { msid, kind });

          const mediaStream = this.getIncomingMediaStreams().find(
            ({ id }) => id === msid
          );

          if (!mediaStream) {
            this.log.warn(
              `Could not locate incoming MediaStream with id "${msid}"`
            );
          } else {
            const tracksOfKind =
              kind === "audio"
                ? mediaStream.getAudioTracks()
                : mediaStream.getVideoTracks();

            if (tracksOfKind.length) {
              this._mediaStreamManagerModule.removeIncomingMediaStreamTrack(
                tracksOfKind[0],
                mediaStream
              );
            }
          }
        })();
        break;

      case SYNC_EVT_DEBUG:
        // TODO: Change implementation, however necessary
        this.log.debug(
          JSON.stringify({
            SYNC_EVT_DEBUG: {
              eventName,
              eventData,
            },
          })
        );
        break;

      default:
        // Route up any unhandled sync events
        this.emit(EVT_SYNC_EVT_RECEIVED, {
          eventName,
          eventData,
        });
        break;
    }
  }

  /**
   * @return {Promise<void>}
   */
  async disconnect() {
    return this.destroy();
  }

  /**
   * Retrieves number of seconds since the WebRTC connection was made.
   *
   * NOTE: If not currently connected, it will return 0.
   *
   * @return {number}
   **/
  getConnectionUptime() {
    if (!this._isConnected) {
      return 0;
    } else {
      const now = getUnixTime();

      return now - this._connectionStartTime;
    }
  }

  /**
   * @return {Promise<void>}
   */
  async destroy() {
    // IMPORTANT: This should be set before any event emitters are emitted, so
    // that counts are updated properly
    delete _instances[this._zenRTCSignalBrokerId];

    // Disconnect handler
    await (async () => {
      if (this._isDestroyed) {
        return;
      }

      if (this._webrtcPeer) {
        this.emitSyncEvent(SYNC_EVT_BYE);

        // Give message some time to get delivered
        await new Promise(resolve => setTimeout(resolve, 100));

        // Check again because the peer may have been destroyed during the async period
        if (this._webrtcPeer) {
          /** @see https://github.com/feross/simple-peer#peerdestroyerr */
          this._webrtcPeer.destroy();

          this._webrtcPeer = null;
        }
      }

      // NOTE: Because of previous await, this is utilized
      if (this._isDestroyed) {
        return;
      }

      // Remove incoming media stream tracks
      // const incomingMediaStreamTracks = this.getIncomingMediaStreamTracks();

      // TODO: Remove (emit in manager)
      /*
      if (incomingMediaStreamTracks) {
        for (const mediaStreamTrack of incomingMediaStreamTracks) {
          // TODO: Refactor; listen to collection itself before emitting this event
          this.emit(EVT_INCOMING_MEDIA_STREAM_TRACK_REMOVED, {
            mediaStreamTrack,
            mediaStream:
              this._mediaStreamManagerModule.getIncomingTrackMediaStream(
                mediaStreamTrack
              ),
          });
        }
      }
      */

      // Remove outgoing media stream tracks
      // const outgoingMediaStreamTracks = this.getOutgoingMediaStreamTracks();

      // TODO: Remove (emit in manager)
      /*
      if (outgoingMediaStreamTracks) {
        for (const mediaStreamTrack of outgoingMediaStreamTracks) {
          // TODO: Refactor; listen to collection itself before emitting this event
          this.emit(EVT_OUTGOING_MEDIA_STREAM_TRACK_REMOVED, {
            mediaStreamTrack,
            mediaStream:
              this._mediaStreamManagerModule.getOutgoingTrackMediaStream(
                mediaStreamTrack
              ),
          });
        }
      }
      */
    })();

    return super.destroy();
  }
}
