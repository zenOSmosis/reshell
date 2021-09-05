import { PhantomCollection, EVT_UPDATED, EVT_DESTROYED } from "phantom-core";
import UIServiceCore from "@core/classes/UIServiceCore";
import { utils } from "media-stream-track-controller";

export default class ScreenCapturerService extends UIServiceCore {
  constructor(...args) {
    super(...args);

    // TODO: Refactor
    this._screenCapturerCollection = new PhantomCollection();
    this.once(EVT_DESTROYED, () => {
      this._screenCapturerCollection.destroy();
    });
    this._screenCapturerCollection.on(EVT_UPDATED, () =>
      this.emit(EVT_UPDATED)
    );
  }

  // TODO: Document
  async startScreenCapture(constraints = {}, factoryOptions = {}) {
    const factory = await utils.captureScreen(constraints, factoryOptions);

    this._screenCapturerCollection.addChild(factory);
  }

  // TODO: Document
  getMediaStreamTracks() {
    return this._screenCapturerCollection
      .getChildren()
      .map((factory) =>
        factory
          .getTrackControllers()
          .map((controller) => controller.getOutputMediaStreamTrack())
      )
      .flat();
  }
}
