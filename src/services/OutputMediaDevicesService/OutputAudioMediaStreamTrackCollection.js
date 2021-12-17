import { ArbitraryPhantomWrapper, PhantomCollection } from "phantom-core";

// TODO: Change to ES6 imports once PhantomCore supports package.json exports
// @see https://github.com/zenOSmosis/phantom-core/issues/98
const { EVT_CHILD_INSTANCE_ADDED, EVT_CHILD_INSTANCE_REMOVED } =
  PhantomCollection;

export { EVT_CHILD_INSTANCE_ADDED, EVT_CHILD_INSTANCE_REMOVED };

// TODO: Build out; ensuring added children are media device controller factories
// class OutputMediaDeviceFactoryCollection extends PhantomCollection {
// TODO: Ensure that added children are of MediaStreamTrackControllerFactory type
// }
export default class OutputAudioMediaStreamTrackCollection extends PhantomCollection {
  // TODO: Document
  addChild(mediaStreamTrack) {
    if (mediaStreamTrack.kind === "audio") {
      if (!this.getChildWithKey(mediaStreamTrack.id)) {
        const phantomAudioWrapper = new PhantomMediaStreamTrackWrapper(
          mediaStreamTrack
        );

        super.addChild(phantomAudioWrapper);
      }
    }
  }

  // TODO: Document
  addOutputMediaStreamTrack(mediaStreamTrack) {
    return this.addChild(mediaStreamTrack);
  }

  // TODO: Document
  async removeChild(mediaStreamTrack) {
    if (mediaStreamTrack.kind === "audio") {
      const phantomAudioWrapper = this.getChildWithKey(mediaStreamTrack.id);

      if (phantomAudioWrapper) {
        await phantomAudioWrapper.destroy();
      }
    }
  }

  // TODO: Document
  async removeOutputMediaStreamTrack(mediaStreamTrack) {
    return this.removeChild(mediaStreamTrack);
  }

  /**
   * @return {Promise<void>}
   */
  async destroy() {
    await this.destroyAllChildren();

    super.destroy();
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
