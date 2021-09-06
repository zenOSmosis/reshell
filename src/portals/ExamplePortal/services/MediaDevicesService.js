import { PhantomCollection } from "phantom-core";
import UIServiceCore from "@core/classes/UIServiceCore";
import {
  MediaStreamTrackControllerFactory,
  utils,
} from "media-stream-track-controller";

// TODO: Build out; ensuring added children are media device controller factories
class MediaDeviceFactoryCollection extends PhantomCollection {}

export default class MediaDevicesService extends UIServiceCore {
  constructor(...args) {
    super(...args);

    // TODO: Re-run when devices have been changed
    this.fetchAudioInputDevices();

    this.bindCollectionClass(MediaDeviceFactoryCollection);
  }

  // TODO: Document
  fetchAudioInputDevices(isAggressive) {
    utils
      .fetchMediaDevices(isAggressive)
      .then(utils.fetchMediaDevices.filterAudioInputDevices)
      .then((devices) => this.setState({ devices }))
      // TODO: Route error to service; make it pipe out UI; etc.
      .catch((err) => console.error(err));
  }

  // TODO: Document
  getMediaDevices() {
    const { devices } = this.getState();

    return devices || [];
  }

  // TODO: Document
  getCaptureFactories() {
    return this.getCollectionInstance(
      MediaDeviceFactoryCollection
    ).getChildren();
  }

  // TODO: Document
  getIsAudioMediaDeviceBeingCaptured(mediaDeviceInfo) {
    return Boolean(
      MediaStreamTrackControllerFactory.getFactoriesWithInputMediaDevice(
        mediaDeviceInfo,
        "audio"
      ).length
    );
  }

  // TODO: Document
  async captureDefaultAudioInputDevice(constraints = {}, factoryOptions = {}) {
    const factory = await utils.captureMediaDevice(constraints, factoryOptions);

    this.getCollectionInstance(MediaDeviceFactoryCollection).addChild(factory);

    return factory;
  }

  // TODO: Document
  async captureSpecificAudioInputDevice(
    mediaDeviceInfo,
    constraints = {},
    factoryOptions = {}
  ) {
    // TODO: Fix issue in media-stream-controller where constraint may look like '0: "a", 2: "u"'
    /*
    const specificConstraints =
      utils.constraints.getSpecificDeviceCaptureConstraints(
        mediaDeviceInfo,
        "audio",
        constraints
      );

    // TODO: Handle
    console.log({ mediaDeviceInfo, specificConstraints });
    */

    const factory = await utils.captureMediaDevice.captureSpecificMediaDevice(
      mediaDeviceInfo,
      constraints,
      factoryOptions
    );

    this.getCollectionInstance(MediaDeviceFactoryCollection).addChild(factory);

    return factory;
  }

  async uncaptureSpecificAudioInputDevice(mediaDeviceInfo) {
    return utils.captureMediaDevice.uncaptureSpecificMediaDevice(
      mediaDeviceInfo
    );
  }
}