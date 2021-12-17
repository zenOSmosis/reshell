import {
  ArbitraryPhantomWrapper,
  PhantomCollection,
  EVT_UPDATED,
  EVT_DESTROYED,
} from "phantom-core";

// TODO: Change to ES6 imports once PhantomCore supports package.json exports
// @see https://github.com/zenOSmosis/phantom-core/issues/98
const { EVT_CHILD_INSTANCE_ADDED, EVT_CHILD_INSTANCE_REMOVED } =
  PhantomCollection;

export { EVT_DESTROYED, EVT_CHILD_INSTANCE_ADDED, EVT_CHILD_INSTANCE_REMOVED };

export const MEDIA_STREAM_TRACK_ADDED = "media-stream-track-added";
export const MEDIA_STREAM_TRACK_REMOVED = "media-stream-track-removed";

// TODO: Document
// FIXME: (jh) This was chosen over media-stream-track-controller tooling out
// of simplicity.  Eventual integration with media-stream-track-controller may
// be better. This has some special handling due to the nature of the
// underlying simple-peer library and WebRTC itself.
export default class ZenRTCPeerMediaStreamCollection extends PhantomCollection {
  /**
   * NOTE: If a duplicate stream is added, it will ignore the subsequent
   * attempt(s).
   *
   * @param {MediaStream} mediaStream
   * @throws {TypeError} Throws if given mediaStream is not a MediaStream
   * instance
   * @return {PhantomMediaStreamWrapper}
   */
  addChild(mediaStream) {
    if (!(mediaStream instanceof MediaStream)) {
      throw new TypeError("mediaStream should be a MediaStream instance");
    }

    const mediaStreamId = mediaStream.id;

    const prev = this.getChildWithKey(mediaStreamId);

    if (prev) {
      return prev;
    } else {
      const mediaStreamWrapper = new PhantomMediaStreamWrapper(mediaStream);

      super.addChild(mediaStreamWrapper, mediaStreamId);

      return mediaStreamWrapper;
    }
  }

  // TODO: Remove?
  // TODO: Document
  /*
  async removeChild(mediaStream) {
    if (!(mediaStream instanceof MediaStream)) {
      throw new TypeError("mediaStream should be a MediaStream instance");
    }

    const child = this.getChildWithKey(mediaStream.id);
    if (child) {
      super.removeChild(child);

      // No longer using the child
      return child.destroy();
    }
  }
  */

  /**
   * @param {MediaStream} mediaStream
   * @return {PhantomMediaStreamWrapper}
   */
  getMediaStreamWrapper(mediaStream) {
    return this.addChild(mediaStream);
  }

  // TODO: Document
  // @emits ...
  addMediaStreamTrack(mediaStreamTrack, mediaStream) {
    const mediaStreamWrapper = this.getMediaStreamWrapper(mediaStream);

    if (!mediaStreamWrapper.getHasMediaStreamTrack(mediaStreamTrack)) {
      mediaStreamWrapper.addMediaStreamTrack(mediaStreamTrack);

      this.emit(MEDIA_STREAM_TRACK_ADDED, {
        mediaStreamTrack,
        mediaStream,
      });
    }
  }

  // TODO: Document
  // @emits ...
  removeMediaStreamTrack(mediaStreamTrack, mediaStream) {
    const mediaStreamWrapper = this.getMediaStreamWrapper(mediaStream);

    // TODO: Check if this track has been "added" to this mediaStreamWrapper
    if (mediaStreamWrapper.getHasMediaStreamTrack(mediaStreamTrack)) {
      mediaStreamWrapper.removeMediaStreamTrack(mediaStreamTrack);

      // TODO: If the media stream has no more tracks, remove the stream from the collection

      this.emit(MEDIA_STREAM_TRACK_REMOVED, {
        mediaStreamTrack,
        mediaStream,
      });
    }
  }

  /**
   * Retrieves container MediaStream from given MediaStreamTrack.
   *
   * NOTE: If the same MediaStreamTrack were to be encased in more than one
   * MediaStream, only the first MediaStream will be returned.
   *
   * @param {MediaStreamTrack} MediaStreamTrack
   * @return {MediaStream | void}
   */
  getTrackMediaStream(mediaStreamTrack) {
    const mediaStreamWrapper = this.getChildren().find(wrapper =>
      wrapper.getMediaStream().getTracks().includes(mediaStreamTrack)
    );

    if (mediaStreamWrapper) {
      return mediaStreamWrapper.getMediaStream();
    }
  }

  /**
   * Retrieves all MediaStream instances contained within this collection.
   *
   * @return {MediaStream[]}
   */
  getMediaStreams() {
    const mediaStreams = this.getChildren().map(wrapper =>
      wrapper.getMediaStream()
    );

    return mediaStreams;
  }

  /**
   * Retrieves all MediaStreamTrack instances contained within this collection.
   *
   * @return {MediaStreamTrack[]}
   */
  getMediaStreamTracks() {
    return this.getMediaStreams()
      .map(mediaStream => mediaStream?.getTracks())
      .flat();
  }

  /**
   * @return {Promise<void>}
   */
  async destroy() {
    await this.destroyAllChildren();

    return super.destroy();
  }
}

// FIXME: (jh) This was chosen over media-stream-track-controller tooling out
// of simplicity.  Eventual integration with media-stream-track-controller may
// be better.
export class PhantomMediaStreamWrapper extends ArbitraryPhantomWrapper {
  constructor(...args) {
    super(...args);

    this._addedMediaStreamTrackIds = [];
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

  // TODO: Document
  addMediaStreamTrack(mediaStreamTrack) {
    if (!(mediaStreamTrack instanceof MediaStreamTrack)) {
      throw new TypeError(
        "mediaStreamTrack must be a MediaStreamTrack instance"
      );
    }

    this._addedMediaStreamTrackIds = [
      ...new Set([...this._addedMediaStreamTrackIds, mediaStreamTrack.id]),
    ];
  }

  // TODO: Remove
  removeMediaStreamTrack(mediaStreamTrack) {
    if (!(mediaStreamTrack instanceof MediaStreamTrack)) {
      throw new TypeError(
        "mediaStreamTrack must be a MediaStreamTrack instance"
      );
    }

    this._addedMediaStreamTrackIds = this._addedMediaStreamTrackIds.filter(
      pred => pred.id !== mediaStreamTrack.id
    );
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

    // TODO: Remove
    console.log({ mediaStreamTrack, added: this._addedMediaStreamTrackIds });

    return this._addedMediaStreamTrackIds.includes(mediaStreamTrack.id);
  }
}
