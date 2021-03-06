import UIServiceCore from "@core/classes/UIServiceCore";
import {
  MediaStreamTrackControllerFactoryCollection,
  utils,
} from "media-stream-track-controller";

// TODO: Build out; ensuring added children are media device controller factories
class ScreenCaptureFactoryCollection extends MediaStreamTrackControllerFactoryCollection {}

// TODO: Document
export default class ScreenCapturerService extends UIServiceCore {
  constructor(...args) {
    super(...args);

    this.setTitle("Screen Capturer Service");

    this.bindCollectionClass(ScreenCaptureFactoryCollection);
  }

  /**
   * Determines if screen capture is supported in the browser.
   *
   * @return {boolean}
   */
  getIsScreenCaptureSupported() {
    return utils.screen.getIsScreenCaptureSupported();
  }

  // TODO: Document
  async startScreenCapture(constraints = {}, factoryOptions = {}) {
    const factory = await utils.screen.captureScreen(
      constraints,
      factoryOptions
    );

    this.getCollectionInstance(
      ScreenCaptureFactoryCollection
    ).addTrackControllerFactory(factory);

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
      .map(factory =>
        factory
          .getTrackControllers()
          .map(controller => controller.getOutputMediaStreamTrack())
      )
      .flat();
  }

  // TODO: Document
  getCaptureFactories() {
    return this.getCollectionInstance(
      ScreenCaptureFactoryCollection
    ).getChildren();
  }
}
