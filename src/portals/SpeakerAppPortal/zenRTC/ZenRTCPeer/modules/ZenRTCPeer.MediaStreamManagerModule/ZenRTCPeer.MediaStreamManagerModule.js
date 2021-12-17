import BaseModule from "../ZenRTCPeer.BaseModule";
import ZenRTCPeerMediaStreamCollection from "./ZenRTCPeerMediaStreamCollection";

export default class ZenRTCPeerMediaStreamManagerModule extends BaseModule {
  constructor(zenRTCPeer) {
    super(zenRTCPeer);

    this._outgoingMediaStreamCollection = new ZenRTCPeerMediaStreamCollection();
    this._incomingMediaStreamCollection = new ZenRTCPeerMediaStreamCollection();

    // Destruct stream collections once stream manager is destructed
    this.registerShutdownHandler(() =>
      Promise.all([
        this._outgoingMediaStreamCollection.destroy(),
        this._incomingMediaStreamCollection.destroy(),
      ])
    );
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
    this._incomingMediaStreamCollection.removeMediaStreamTrack(
      mediaStreamTrack,
      mediaStream
    );
  }
}
