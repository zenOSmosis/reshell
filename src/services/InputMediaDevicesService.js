import { PhantomCollection } from "phantom-core";
import UIServiceCore from "@core/classes/UIServiceCore";
import {
  MediaStreamTrackControllerFactory,
  utils,
} from "media-stream-track-controller";
import { untilAudioContextResumed as libUntilAudioContextResumed } from "media-stream-track-controller/src/utils";

class InputMediaDeviceFactoryCollection extends PhantomCollection {
  // TODO: Ensure that added children are of MediaStreamTrackControllerFactory type
}

export default class InputMediaDevicesService extends UIServiceCore {
  constructor(...args) {
    super(...args);

    this.setTitle("Input Media Devices Service");

    this.setState({
      isFetchingMediaDevices: false,
      isAudioContextStarted: false,
      devices: [],
    });

    // TODO: Re-fetch when devices have been changed
    // TODO: Capture fetch errors and set them as state / UI notifications

    this.fetchAudioInputDevices();

    this.bindCollectionClass(InputMediaDeviceFactoryCollection);
  }

  // TODO: Document
  async fetchAudioInputDevices(isAggressive) {
    this.setState({ isFetchingMediaDevices: true });

    // Fixes issue where sending media stream track to remote peers is muted
    // until something starts the audio context
    //
    // IMPORTANT: This isn't the ONLY fix related to this, and others are
    // specified in the LocalZenRTCPeer connect sequence (currently part of
    // SpeakerAppPortal)
    await this.untilAudioContextResumed();

    const audioInputDevices = await utils
      .fetchMediaDevices(isAggressive)
      .then(utils.fetchMediaDevices.filterAudioInputDevices)
      .catch(console.error)
      .finally(() => this.setState({ isFetchingMediaDevices: false }));

    this.setState({ devices: audioInputDevices });
  }

  // TODO: Document
  async untilAudioContextResumed() {
    await libUntilAudioContextResumed();

    this.setState({
      isAudioContextStarted: true,
    });
  }

  /**
   * Retreives whether or not this service is currently fetching media devices.
   *
   * @return {boolean}
   */
  getIsFetchingMediaDevices() {
    return this.getState().isFetchingMediaDevices;
  }

  // TODO: Document
  getMediaDevices() {
    const { devices } = this.getState();

    return devices || [];
  }

  // TODO: Document
  getCaptureFactories() {
    return this.getCollectionInstance(
      InputMediaDeviceFactoryCollection
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
  getMediaDeviceCaptureFactory(mediaDeviceInfo) {
    const factories =
      MediaStreamTrackControllerFactory.getFactoriesWithInputMediaDevice(
        mediaDeviceInfo,
        "audio"
      );

    if (factories) {
      return factories[0];
    }
  }

  // TODO: Document
  async captureDefaultAudioInputDevice(constraints = {}, factoryOptions = {}) {
    const factory = await utils.captureMediaDevice(constraints, factoryOptions);

    this.getCollectionInstance(InputMediaDeviceFactoryCollection).addChild(
      factory
    );

    return factory;
  }

  // TODO: Document
  async captureSpecificAudioInputDevice(
    mediaDeviceInfo,
    constraints = {},
    factoryOptions = {}
  ) {
    const factory = await utils.captureMediaDevice.captureSpecificMediaDevice(
      mediaDeviceInfo,
      constraints,
      factoryOptions
    );

    this.getCollectionInstance(InputMediaDeviceFactoryCollection).addChild(
      factory
    );

    return factory;
  }

  // TODO: Document
  async uncaptureSpecificAudioInputDevice(mediaDeviceInfo) {
    return utils.captureMediaDevice.uncaptureSpecificMediaDevice(
      mediaDeviceInfo
    );
  }
}
