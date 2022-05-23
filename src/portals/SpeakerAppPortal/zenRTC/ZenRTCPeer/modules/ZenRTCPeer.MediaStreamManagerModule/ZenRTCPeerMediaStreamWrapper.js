import { ArbitraryPhantomWrapper } from "phantom-core";

// FIXME: (jh) This was chosen over media-stream-track-controller tooling out
// of simplicity.  Eventual integration with media-stream-track-controller may
// be better.
export default class ZenRTCPeerMediaStreamWrapper extends ArbitraryPhantomWrapper {
  constructor(...args) {
    super(...args);

    // IMPORTANT: This is necessary because added media streams may already
    // have a track associated with them, and we want to determine if they have
    // been "added" with this class, instead
    this._managedMediaStreamTrackIds = [];
  }

  /**
   * @param {MediaStream} wrappedValue
   * @return {void}
   */
  _setWrappedValue(wrappedValue) {
    if (!(wrappedValue instanceof MediaStream)) {
      throw new TypeError("wrappedValue must be a MediaStream instance");
    }

    return super._setWrappedValue(wrappedValue);
  }

  /**
   * @return {MediaStream}
   */
  getMediaStream() {
    return this.getWrappedValue();
  }

  /**
   * @param {MediaStreamTrack} mediaStreamTrack
   * @return {void}
   */
  addMediaStreamTrack(mediaStreamTrack) {
    if (!(mediaStreamTrack instanceof MediaStreamTrack)) {
      throw new TypeError(
        "mediaStreamTrack must be a MediaStreamTrack instance"
      );
    }

    // NOTE: The MediaStreamTrack may already be added to the MediaStream,
    // however duplicate tries are ignored
    const mediaStream = this.getMediaStream();
    mediaStream.addTrack(mediaStreamTrack);

    this._managedMediaStreamTrackIds = [
      ...new Set([...this._managedMediaStreamTrackIds, mediaStreamTrack.id]),
    ];
  }

  /**
   * @param {MediaStreamTrack} mediaStreamTrack
   * @return {Promise<void>}
   */
  async removeMediaStreamTrack(mediaStreamTrack) {
    if (!(mediaStreamTrack instanceof MediaStreamTrack)) {
      throw new TypeError(
        "mediaStreamTrack must be a MediaStreamTrack instance"
      );
    }

    const mediaStream = this.getMediaStream();
    mediaStream.removeTrack(mediaStreamTrack);

    this._managedMediaStreamTrackIds = this._managedMediaStreamTrackIds.filter(
      pred => pred.id !== mediaStreamTrack.id
    );

    // Destruct if no more tracks
    if (!this._managedMediaStreamTrackIds.length) {
      if (!this.getHasDestroyStarted()) {
        return this.destroy();
      }
    }
  }

  /**
   * Determines whether or not the wrapped MediaStream includes the given
   * MediaStreamTrack.
   *
   * @param {MediaStreamTrack} mediaStreamTrack
   * @return {boolean}
   */
  getHasMediaStreamTrack(mediaStreamTrack) {
    if (!(mediaStreamTrack instanceof MediaStreamTrack)) {
      throw new TypeError(
        "mediaStreamTrack must be a MediaStreamTrack instance"
      );
    }

    return this._managedMediaStreamTrackIds.includes(mediaStreamTrack.id);
  }
}
