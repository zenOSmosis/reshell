import { EVT_DISCONNECTED, EVT_UPDATED } from "../../ZenRTCPeer";

import { SYNC_EVT_TRACK_REMOVED } from "@portals/SpeakerAppPortal/shared/syncEvents";

import BaseModule from "../ZenRTCPeer.BaseModule";
import ZenRTCPeerMediaStreamCollection, {
  MEDIA_STREAM_TRACK_ADDED,
  MEDIA_STREAM_TRACK_REMOVED,
} from "./ZenRTCPeerMediaStreamCollection";

// TODO: Document
export const EVT_INCOMING_MEDIA_STREAM_TRACK_ADDED =
  "incoming-media-stream-track-added";
// TODO: Document
export const EVT_INCOMING_MEDIA_STREAM_TRACK_REMOVED =
  "incoming-media-stream-track-removed";

// TODO: Document
export const EVT_OUTGOING_MEDIA_STREAM_TRACK_ADDED =
  "outgoing-media-stream-track-added";
// TODO: Document
export const EVT_OUTGOING_MEDIA_STREAM_TRACK_REMOVED =
  "outgoing-media-stream-track-removed";

/**
 * Manages incoming / outgoing MediaStream / MediaStreamTrack instances for
 * ZenRTC.
 */
export default class ZenRTCPeerMediaStreamManagerModule extends BaseModule {
  constructor(zenRTCPeer) {
    super(zenRTCPeer);

    this._incomingMediaStreamCollection = new ZenRTCPeerMediaStreamCollection();
    this._outgoingMediaStreamCollection = new ZenRTCPeerMediaStreamCollection();

    // Destruct stream collections once stream manager is destructed
    this.registerShutdownHandler(() =>
      Promise.all([
        this._incomingMediaStreamCollection.destroy(),
        this._outgoingMediaStreamCollection.destroy(),
      ])
    );

    // Manage track collection to ZenRTCPeer event proxying and track publishing
    (() => {
      /**
       * Creates a new MediaStreamTrack clone, or retrieves an existing one,
       * for the lifecycle of the current ZenRTC connection.
       *
       * WHY: Safari 15 (+/-) will not send tracks on subsequent connections
       * which have been sent on prior connections (i.e. if not stopping the
       * track source before starting a new connection) will not send through
       * the connection, so the track has to be cloned.
       *
       * Fixes issue: https://github.com/jzombie/pre-re-shell/issues/67
       *
       * @param {MediaStreamTrack} mediaStreamTrack
       * @return {MediaStreamTrack} Cloned media stream track
       */
      const getTrackClone = (() => {
        /**
         * Original MediaStreamTrack ID is the key; cloned MediaStreamTrack is
         * the value,
         *
         * @type { [key: string]: MediaStreamTrack }
         **/
        let _trackClones = {};

        // Empty track clones on disconnect
        this.proxyOn(zenRTCPeer, EVT_DISCONNECTED, () => {
          _trackClones = {};
        });

        return function getTrackClone(mediaStreamTrack) {
          const mediaStreamTrackId = mediaStreamTrack.id;

          if (_trackClones[mediaStreamTrackId]) {
            return _trackClones[mediaStreamTrackId];
          } else {
            _trackClones[mediaStreamTrackId] = mediaStreamTrack.clone();

            return _trackClones[mediaStreamTrackId];
          }
        };
      })();

      this.proxyOn(
        this._incomingMediaStreamCollection,
        MEDIA_STREAM_TRACK_ADDED,
        data => {
          // Emit track information to output device handlers, etc.
          zenRTCPeer.emit(EVT_INCOMING_MEDIA_STREAM_TRACK_ADDED, data);

          // Emit UI updates, etc.
          zenRTCPeer.emit(EVT_UPDATED);
        }
      );

      this.proxyOn(
        this._incomingMediaStreamCollection,
        MEDIA_STREAM_TRACK_REMOVED,
        data => {
          // Emit track information to output device handlers, etc.
          zenRTCPeer.emit(EVT_INCOMING_MEDIA_STREAM_TRACK_REMOVED, data);

          // Emit UI updates, etc.
          zenRTCPeer.emit(EVT_UPDATED);
        }
      );

      this.proxyOn(
        this._outgoingMediaStreamCollection,
        MEDIA_STREAM_TRACK_ADDED,
        data => {
          const { mediaStreamTrack, mediaStream } = data;

          try {
            // IMPORTANT: This track clone fixes an issue in Safari. Read the
            // "WHY" section above for more information.
            zenRTCPeer
              .getWebRTCPeer()
              ?.addTrack(getTrackClone(mediaStreamTrack), mediaStream);
          } catch (err) {
            this.log.error(err);
          }

          // Emit track information to output device handlers, etc.
          zenRTCPeer.emit(EVT_OUTGOING_MEDIA_STREAM_TRACK_ADDED, data);

          // Emit UI updates, etc.
          zenRTCPeer.emit(EVT_UPDATED);
        }
      );

      this.proxyOn(
        this._outgoingMediaStreamCollection,
        MEDIA_STREAM_TRACK_REMOVED,
        async data => {
          const { mediaStreamTrack, mediaStream } = data;

          try {
            // IMPORTANT: This track clone fixes an issue in Safari. Read the
            // "WHY" section above for more information.
            await zenRTCPeer
              .getWebRTCPeer()
              ?.removeTrack(getTrackClone(mediaStreamTrack), mediaStream);
          } catch (err) {
            this.log.error(err);
          }

          // Signal to remote that we've removed the track
          //
          // NOTE (jh): This is a workaround since WebRTCPeer does not emit track
          // removed events directly
          zenRTCPeer.emitSyncEvent(SYNC_EVT_TRACK_REMOVED, {
            msid: mediaStream.id,
            kind: mediaStreamTrack.kind,
          });

          // Emit track information to output device handlers, etc.
          zenRTCPeer.emit(EVT_OUTGOING_MEDIA_STREAM_TRACK_REMOVED, data);

          // Emit UI updates, etc.
          zenRTCPeer.emit(EVT_UPDATED);
        }
      );
    })();
  }

  /**
   * @return {ZenRTCPeerMediaStreamCollection}
   */
  getIncomingMediaStreamCollection() {
    return this._incomingMediaStreamCollection;
  }

  /**
   * @return {MediaStream[]}
   */
  getIncomingMediaStreams() {
    return this._incomingMediaStreamCollection.getMediaStreams();
  }

  /**
   * @param {MediaStreamTrack}
   * @return {MediaStream | void}
   */
  getIncomingTrackMediaStream(mediaStreamTrack) {
    return this._incomingMediaStreamCollection.getTrackMediaStream(
      mediaStreamTrack
    );
  }

  /**
   * @return {MediaStreamTrack[]}
   */
  getIncomingMediaStreamTracks() {
    return this._incomingMediaStreamCollection.getMediaStreamTracks();
  }

  /**
   * @param {MediaStreamTrack} mediaStreamTrack
   * @param {MediaStream} mediaStream
   * @return {void}
   */
  addIncomingMediaStreamTrack(mediaStreamTrack, mediaStream) {
    // If MediaStream is not already added to list of incoming media streams, add it
    this._incomingMediaStreamCollection.addMediaStreamTrack(
      mediaStreamTrack,
      mediaStream
    );
  }

  /**
   * @param {MediaStreamTrack} mediaStreamTrack
   * @param {MediaStream} mediaStream
   * @return {void}
   */
  removeIncomingMediaStreamTrack(mediaStreamTrack, mediaStream) {
    this._incomingMediaStreamCollection.removeMediaStreamTrack(
      mediaStreamTrack,
      mediaStream
    );
  }

  /**
   * @return {ZenRTCPeerMediaStreamCollection}
   */
  getOutgoingMediaStreamCollection() {
    return this._outgoingMediaStreamCollection;
  }

  /**
   * @return {MediaStream[]}
   */
  getOutgoingMediaStreams() {
    return this._outgoingMediaStreamCollection.getMediaStreams();
  }

  /**
   * @param {MediaStreamTrack}
   * @return {MediaStream | void}
   */
  getOutgoingTrackMediaStream(mediaStreamTrack) {
    return this._outgoingMediaStreamCollection.getTrackMediaStream(
      mediaStreamTrack
    );
  }

  /**
   * @return {MediaStreamTrack[]}
   */
  getOutgoingMediaStreamTracks() {
    return this._outgoingMediaStreamCollection.getMediaStreamTracks();
  }

  /**
   * @param {MediaStreamTrack} mediaStreamTrack
   * @param {MediaStream} mediaStream
   * @return {void}
   */
  addOutgoingMediaStreamTrack(mediaStreamTrack, mediaStream) {
    this._outgoingMediaStreamCollection.addMediaStreamTrack(
      mediaStreamTrack,
      mediaStream
    );
  }

  /**
   * @param {MediaStreamTrack} mediaStreamTrack
   * @param {MediaStream} mediaStream
   * @return {void}
   */
  removeOutgoingMediaStreamTrack(mediaStreamTrack, mediaStream) {
    this._outgoingMediaStreamCollection.removeMediaStreamTrack(
      mediaStreamTrack,
      mediaStream
    );
  }
}
