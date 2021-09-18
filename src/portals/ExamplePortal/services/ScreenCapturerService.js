import { PhantomCollection } from "phantom-core";
import UIServiceCore from "@core/classes/UIServiceCore";
import { utils } from "media-stream-track-controller";

// TODO: Build out; ensuring added children are media device controller factories
class ScreenCaptureFactoryCollection extends PhantomCollection {}

// TODO: Document
export default class ScreenCapturerService extends UIServiceCore {
  constructor(...args) {
    super(...args);

    this.bindCollectionClass(ScreenCaptureFactoryCollection);
  }

  // TODO: Document
  async startScreenCapture(constraints = {}, factoryOptions = {}) {
    const factory = await utils.captureScreen(constraints, factoryOptions);

    this.getCollectionInstance(ScreenCaptureFactoryCollection).addChild(
      factory
    );

    return factory;
  }

  /**
   * Returns all media stream tracks from all of the factories as a flat array.
   *
   * @return {MediaStreamTrack[]}
   */
  getMediaStreamTracks() {
    return this.getCollectionInstance(ScreenCaptureFactoryCollection)
      .getChildren()
      .map((factory) =>
        factory
          .getTrackControllers()
          .map((controller) => controller.getOutputMediaStreamTrack())
      )
      .flat();
  }
}
