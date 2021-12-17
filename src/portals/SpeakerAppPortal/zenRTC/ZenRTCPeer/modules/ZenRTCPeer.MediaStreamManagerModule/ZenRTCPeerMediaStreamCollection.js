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

export {
  EVT_UPDATED,
  EVT_DESTROYED,
  EVT_CHILD_INSTANCE_ADDED,
  EVT_CHILD_INSTANCE_REMOVED,
};

// TODO: Document
// FIXME: (jh) This was chosen over media-stream-track-controller tooling out
// of simplicity.  Eventual integration with media-stream-track-controller may
// be better.
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
  addMediaStreamTrack(mediaStreamTrack, mediaStream) {
    const mediaStreamWrapper = this.getMediaStreamWrapper(mediaStream);

    if (!mediaStreamWrapper.getHasMediaStreamTrack(mediaStreamTrack)) {
      mediaStream.addTrack(mediaStreamTrack);

      this.emit(EVT_UPDATED);
    }
  }

  // TODO: Document
  removeMediaStreamTrack(mediaStreamTrack, mediaStream) {
    const mediaStreamWrapper = this.getMediaStreamWrapper(mediaStream);

    if (mediaStreamWrapper.getHasMediaStreamTrack(mediaStreamTrack)) {
      mediaStream.removeTrack(mediaStreamTrack);

      this.emit(EVT_UPDATED);
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
    return this.getChildren().map(wrapper => wrapper.getMediaStream());
  }

  /**
   * Retrieves all MediaStreamTrack instances contained within this collection.
   *
   * @return {MediaStreamTrack[]}
   */
  getMediaStreamTracks() {
    return this.getMediaStreams()
      .map(mediaStream => mediaStream?.getTracks())
      .filter(tracks => Boolean(tracks))
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
   * Determines whether or not the wrapped MediaStream includes the given
   * MediaStreamTrack.
   *
   * @param {MediaStreamTrack} mediaStreamTrack
   * @return {boolean}
   */
  getHasMediaStreamTrack(mediaStreamTrack) {
    const mediaStream = this.getWrappedValue();

    return mediaStream.getTracks().includes(mediaStreamTrack);
  }
}
