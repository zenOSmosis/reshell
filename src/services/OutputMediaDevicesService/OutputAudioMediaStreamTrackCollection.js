import PhantomCore, { PhantomCollection } from "phantom-core";

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
  addChild(mediaStreamTrack, mediaStream) {
    if (mediaStreamTrack.kind === "audio") {
      if (!this.getChildWithKey(mediaStreamTrack.id)) {
        const phantomAudioWrapper = new PhantomCore();
        phantomAudioWrapper.__audioMediaStreamTrack = mediaStreamTrack;

        super.addChild(phantomAudioWrapper);
      }
    }
  }

  // TODO: Document
  addOutputMediaStreamTrack(mediaStreamTrack, mediaStream) {
    return this.addChild(mediaStreamTrack, mediaStream);
  }

  // TODO: Document
  async removeChild(mediaStreamTrack, mediaStream) {
    if (mediaStreamTrack.kind === "audio") {
      // TODO: Remove
      console.log("TODO: Handle removeOutputMediaStreamTrack", {
        mediaStreamTrack,
        mediaStream,
      });

      const phantomAudioWrapper = this.getChildWithKey(mediaStreamTrack.id);

      if (phantomAudioWrapper) {
        await phantomAudioWrapper.destroy();
      }
    }
  }

  // TODO: Document
  async removeOutputMediaStreamTrack(mediaStreamTrack, mediaStream) {
    return this.removeChild(mediaStreamTrack, mediaStream);
  }

  /**
   * @return {Promise<void>}
   */
  async destroy() {
    await this.destroyAllChildren();

    super.destroy();
  }
}
