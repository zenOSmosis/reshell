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

    // Event proxying
    (() => {
      this.proxyOn(
        this._incomingMediaStreamCollection,
        MEDIA_STREAM_TRACK_ADDED,
        data => this.emit(EVT_INCOMING_MEDIA_STREAM_TRACK_ADDED, data)
      );
      this.proxyOn(
        this._incomingMediaStreamCollection,
        MEDIA_STREAM_TRACK_REMOVED,
        data => this.emit(EVT_INCOMING_MEDIA_STREAM_TRACK_REMOVED, data)
      );

      this.proxyOn(
        this._outgoingMediaStreamCollection,
        MEDIA_STREAM_TRACK_ADDED,
        data => this.emit(EVT_OUTGOING_MEDIA_STREAM_TRACK_ADDED, data)
      );
      this.proxyOn(
        this._outgoingMediaStreamCollection,
        MEDIA_STREAM_TRACK_REMOVED,
        data => this.emit(EVT_OUTGOING_MEDIA_STREAM_TRACK_REMOVED, data)
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
