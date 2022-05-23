import { ArbitraryPhantomWrapper, PhantomCollection } from "phantom-core";

// TODO: Change to namespaced export once PhantomCore supports package.json exports
// @see https://github.com/zenOSmosis/phantom-core/issues/98
import {
  EVT_CHILD_INSTANCE_ADD,
  EVT_CHILD_INSTANCE_REMOVE,
} from "phantom-core";

export { EVT_CHILD_INSTANCE_ADD, EVT_CHILD_INSTANCE_REMOVE };

export default class OutputMediaStreamTrackCollection extends PhantomCollection {
  // TODO: Document
  addChild(mediaStreamTrack) {
    if (!(mediaStreamTrack instanceof MediaStreamTrack)) {
      throw new TypeError(
        "mediaStreamTrack must be a MediaStreamTrack instance"
      );
    }

    const mediaStreamTrackId = mediaStreamTrack.id;

    if (!this.getChildWithKey(mediaStreamTrackId)) {
      const phantomAudioWrapper = new PhantomMediaStreamTrackWrapper(
        mediaStreamTrack
      );

      super.addChild(phantomAudioWrapper, mediaStreamTrackId);
    }
  }

  // TODO: Document
  addOutputMediaStreamTrack(mediaStreamTrack) {
    return this.addChild(mediaStreamTrack);
  }

  // TODO: Document
  async removeChild(mediaStreamTrack) {
    const phantomAudioWrapper = this.getChildWithKey(mediaStreamTrack.id);

    if (phantomAudioWrapper) {
      await phantomAudioWrapper.destroy();
    }

    return super.removeChild(mediaStreamTrack);
  }

  // TODO: Document
  async removeOutputMediaStreamTrack(mediaStreamTrack) {
    return this.removeChild(mediaStreamTrack);
  }

  /**
   * @return {MediaStreamTrack[]}
   */
  getOutputMediaStreamTracks() {
    return (
      this.getChildren()
        .map(wrapper => wrapper.getMediaStreamTrack())
        // TODO: This filtering shouldn't be necessary, and should be handled
        // internally by the collection using ArbitraryPhantomWrapper
        .filter(mediaStreamTrack => Boolean(mediaStreamTrack))
    );
  }

  /**
   * @return {MediaStreamTrack[]}
   */
  getOutputAudioMediaStreamTracks() {
    return this.getOutputMediaStreamTracks().filter(
      ({ kind }) => kind === "audio"
    );
  }

  /**
   * @return {MediaStreamTrack[]}
   */
  getOutputVideoMediaStreamTracks() {
    return this.getOutputMediaStreamTracks().filter(
      ({ kind }) => kind === "video"
    );
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
export class PhantomMediaStreamTrackWrapper extends ArbitraryPhantomWrapper {
  /**
   * @param {MediaStreamTrack} wrappedValue
   * @return {void}
   */
  _setWrappedValue(wrappedValue) {
    if (!(wrappedValue instanceof MediaStreamTrack)) {
      throw new TypeError("wrappedValue must be a MediaStreamTrack instance");
    }

    return super._setWrappedValue(wrappedValue);
  }

  /**
   * @return {MediaStreamTrack}
   */
  getMediaStreamTrack() {
    return this.getWrappedValue();
  }
}
