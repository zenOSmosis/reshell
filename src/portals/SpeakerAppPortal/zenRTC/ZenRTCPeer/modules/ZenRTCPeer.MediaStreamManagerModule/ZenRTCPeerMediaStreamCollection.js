import { PhantomCollection, EVT_DESTROY } from "phantom-core";
import ZenRTCPeerMediaStreamWrapper from "./ZenRTCPeerMediaStreamWrapper";

// TODO: Change to namespaced export once PhantomCore supports package.json exports
// @see https://github.com/zenOSmosis/phantom-core/issues/98
import {
  EVT_CHILD_INSTANCE_ADD,
  EVT_CHILD_INSTANCE_REMOVE,
} from "phantom-core";

export { EVT_DESTROY, EVT_CHILD_INSTANCE_ADD, EVT_CHILD_INSTANCE_REMOVE };

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
   * @return {ZenRTCPeerMediaStreamWrapper}
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
      const mediaStreamWrapper = new ZenRTCPeerMediaStreamWrapper(mediaStream);

      super.addChild(mediaStreamWrapper, mediaStreamId);

      return mediaStreamWrapper;
    }
  }

  /**
   * Creates a new MediaStreamWrapper or returns existing one from cache.
   *
   * @param {MediaStream} mediaStream
   * @return {ZenRTCPeerMediaStreamWrapper}
   */
  getOrCreateMediaStreamWrapper(mediaStream) {
    return this.addChild(mediaStream);
  }

  // TODO: Document
  // @emits ...
  addMediaStreamTrack(mediaStreamTrack, mediaStream) {
    const mediaStreamWrapper = this.getOrCreateMediaStreamWrapper(mediaStream);

    if (!mediaStreamWrapper.getHasMediaStreamTrack(mediaStreamTrack)) {
      (() => {
        const oEnded = mediaStreamTrack.onended;

        // FIXME: (jh) Firefox 86 doesn't listen to "ended" event, and the
        // functionality has to be monkey-patched into the onended handler. Note
        // that this still works in conjunction with
        // track.dispatchEvent(new Event("ended")).
        //
        // FIXME: (jh) media-stream-track-controller has some of this handling
        // built in, and it might be better to use it instead.
        mediaStreamTrack.onended = async (...args) => {
          if (typeof oEnded === "function") {
            oEnded(...args);
          }

          this.log.debug(
            "Automatically removing ended media stream track",
            mediaStreamTrack
          );

          await this.removeMediaStreamTrack(mediaStreamTrack, mediaStream);
        };
      })();

      mediaStreamWrapper.addMediaStreamTrack(mediaStreamTrack);

      this.emit(MEDIA_STREAM_TRACK_ADDED, {
        mediaStreamTrack,
        mediaStream,
      });
    }
  }

  // TODO: Document
  // @emits ...
  async removeMediaStreamTrack(mediaStreamTrack, mediaStream) {
    const mediaStreamWrapper = this.getOrCreateMediaStreamWrapper(mediaStream);

    // TODO: Check if this track has been "added" to this mediaStreamWrapper
    if (mediaStreamWrapper.getHasMediaStreamTrack(mediaStreamTrack)) {
      await mediaStreamWrapper.removeMediaStreamTrack(mediaStreamTrack);

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
    return super.destroy(async () => {
      await this.destroyAllChildren();
    });
  }
}
