import { PhantomCollection } from "phantom-core";
import UIServiceCore from "@core/classes/UIServiceCore";
import {
  MediaStreamTrackControllerFactory,
  utils,
} from "media-stream-track-controller";

import MediaDeviceCachingService from "./MediaDeviceCachingService";

// TODO: Refactor
class InputMediaDeviceFactoryCollection extends PhantomCollection {
  // TODO: Ensure that added children are of MediaStreamTrackControllerFactory type
}

/**
 * Manages capturing of physical input media devices (i.e. microphone or camera).
 *
 * It does not manage virtual devices, such as screen captures, canvas, etc.
 */
export default class InputMediaDevicesService extends UIServiceCore {
  constructor(...args) {
    super(...args);

    this.setTitle("Input Media Devices Service");

    this.setState({
      isFetchingMediaDevices: false,
      isAudioContextStarted: false,
      devices: [],
    });

    this._mediaDeviceCachingService = this.useServiceClass(
      MediaDeviceCachingService
    );

    // TODO: Re-fetch when devices have been changed (listen to event; backport
    // from original Speaker.app)
    //
    // TODO: Capture fetch errors and set them as state / UI notifications

    this.fetchInputMediaDevices();

    this.bindCollectionClass(InputMediaDeviceFactoryCollection);
  }

  /**
   * Performs a "system call" against the browser in order to determine
   * physical input media devices.
   *
   * This will internally cache the media device info in the state, and calls
   * to this.getInputMediaDevices() can retrieve that state for the UI.
   *
   * @param {boolean} isAggressive [default = true]  If true, temporarily
   * turn on devices in order to obtain label information.
   * @return {MediaDeviceInfo[] || Object[]}
   */
  async fetchInputMediaDevices(isAggressive = true) {
    this.setState({ isFetchingMediaDevices: true });

    // Fixes issue where sending media stream track to remote peers is muted
    // until something starts the audio context (TODO: Define which
    // environments this is happening in; all? Should this fix be moved into
    // media-stream-track-controller itself?)
    //
    // IMPORTANT: This isn't the ONLY fix related to this, and others are
    // specified in the LocalZenRTCPeer connect sequence (currently part of
    // SpeakerAppPortal)
    await this.untilAudioContextResumed();

    const inputMediaDevices = await utils.mediaDevice
      .fetchInputMediaDevices(isAggressive)
      .catch(console.error)
      .finally(() => this.setState({ isFetchingMediaDevices: false }));

    // Set the captured device information as state so that calls to
    // this.getInputMediaDevices() can retrieve cached state, and any UI
    // listeners can see the state of cached device information.
    this.setState({ devices: inputMediaDevices });

    return inputMediaDevices;
  }

  // TODO: Document
  async untilAudioContextResumed() {
    await utils.audioContext.untilAudioContextResumed();

    this.setState({
      isAudioContextStarted: true,
    });
  }

  /**
   * Retrieves whether or not this service is currently fetching media devices.
   *
   * @return {boolean}
   */
  getIsFetchingMediaDevices() {
    return this.getState().isFetchingMediaDevices;
  }

  // TODO: Document
  //
  // IMPORTANT: This depends on a prior resolved call to
  // this.fetchInputMediaDevices() before this will return anything
  getInputMediaDevices() {
    const { devices } = this.getState();

    return devices || [];
  }

  // TODO: Document
  //
  // IMPORTANT: This depends on a prior resolved call to
  // this.fetchInputMediaDevices() before this will return anything
  getAudioInputMediaDevices() {
    const inputMediaDevices = this.getInputMediaDevices();

    // TODO: Use utility function for filtering
    return inputMediaDevices.filter(predicate =>
      predicate.kind.includes("audioinput")
    );
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
        // TODO: Use constant here
        "audio"
      ).length
    );
  }

  // TODO: Document
  getMediaDeviceCaptureFactory(mediaDeviceInfo) {
    const factories =
      MediaStreamTrackControllerFactory.getFactoriesWithInputMediaDevice(
        mediaDeviceInfo,
        // TODO: Use constant here
        "audio"
      );

    if (factories) {
      return factories[0];
    }
  }

  // TODO: Document
  //
  // IMPORTANT: For most use cases, use this.captureSpecificAudioInputDevice
  // instead
  /*
  async captureDefaultAudioInputDevice(
    userConstraints = {},
    factoryOptions = {}
  ) {
    // TODO: Implement ability to apply preset quality settings to default
    // audio device (potentially obtain default audio device from list, apply
    // the settings there, then call this.captureSpecificAudioInputDevice())

    const factory = await utils.mediaDevice.captureMediaDevice(
      userConstraints,
      factoryOptions
    );

    this.getCollectionInstance(InputMediaDeviceFactoryCollection).addChild(
      factory
    );

    return factory;
  }
  */

  // TODO: Document
  async captureSpecificAudioInputDevice(
    mediaDeviceInfo,
    userConstraints = {},
    factoryOptions = {}
  ) {
    const factory = await utils.mediaDevice.captureSpecificMediaDevice(
      mediaDeviceInfo,
      userConstraints,
      factoryOptions
    );

    this.getCollectionInstance(InputMediaDeviceFactoryCollection).addChild(
      factory
    );

    return factory;
  }

  // TODO: Document
  async uncaptureSpecificAudioInputDevice(mediaDeviceInfo) {
    return utils.mediaDevice.uncaptureSpecificMediaDevice(mediaDeviceInfo);
  }
}
