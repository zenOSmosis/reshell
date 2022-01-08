import UIServiceCore from "@core/classes/UIServiceCore";
import {
  MediaStreamTrackControllerFactory,
  MediaStreamTrackControllerFactoryCollection,
  utils,
} from "media-stream-track-controller";

import MediaDeviceCachingService from "./MediaDeviceCachingService";

class InputMediaDeviceFactoryCollection extends MediaStreamTrackControllerFactoryCollection {}

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

    this._inputMediaDeviceFactoryCollection = this.bindCollectionClass(
      InputMediaDeviceFactoryCollection
    );

    // TODO: Re-fetch when devices have been changed (listen to event; backport
    // from original Speaker.app)
    //
    // TODO: Capture fetch errors and set them as state / UI notifications

    this.fetchInputMediaDevices();
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

    // TODO: Remove
    console.log({ inputMediaDevices });

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
    return this._inputMediaDeviceFactoryCollection.getTrackControllerFactories();
  }

  // TODO: Document
  getIsAudioMediaDeviceBeingCaptured(mediaDeviceInfo) {
    return Boolean(
      MediaStreamTrackControllerFactory.getFactoriesWithInputMediaDevice(
        mediaDeviceInfo,
        // TODO: Use constant here
        // TODO: Auto-detect this input value from the device (within
        // media-stream-track-controller)
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
  // IMPORTANT: For most use cases, use this.captureSpecificMediaDevice
  // instead
  /*
  async captureDefaultAudioInputDevice(
    userConstraints = {},
    factoryOptions = {}
  ) {
    // TODO: Implement ability to apply preset quality settings to default
    // audio device (potentially obtain default audio device from list, apply
    // the settings there, then call this.captureSpecificMediaDevice())

    const factory = await utils.mediaDevice.captureMediaDevice(
      userConstraints,
      factoryOptions
    );

    this._inputMediaDeviceFactoryCollection.addTrackControllerFactory(
      factory
    );

    return factory;
  }
  */

  // TODO: Document
  async captureSpecificMediaDevice(
    mediaDeviceInfo,
    userConstraints = {},
    factoryOptions = {}
  ) {
    const factory = await utils.mediaDevice.captureSpecificMediaDevice(
      mediaDeviceInfo,
      userConstraints,
      factoryOptions
    );

    this._inputMediaDeviceFactoryCollection.addTrackControllerFactory(factory);

    return factory;
  }

  // TODO: Document
  async uncaptureSpecificMediaDevice(mediaDeviceInfo) {
    return utils.mediaDevice.uncaptureSpecificMediaDevice(mediaDeviceInfo);
  }

  /**
   * Determines whether or not any audio input devices are currently capturing.
   *
   * @return {boolean}
   */
  getIsCapturingAnyAudio() {
    return this._inputMediaDeviceFactoryCollection.getAudioTrackControllers()
      .length;
  }

  /**
   * Determines whether or not all audio input devices are muted.
   *
   * @return {boolean}
   */
  getIsAllAudioMuted() {
    return this._inputMediaDeviceFactoryCollection.getIsAudioMuted();
  }

  /**
   * Sets whether or not all audio input devices are muted.
   *
   * @param {boolean} isAllAudioMuted
   * @return {void}
   */
  setIsAllAudioMuted(isAllAudioMuted) {
    return this._inputMediaDeviceFactoryCollection.setIsAudioMuted(
      isAllAudioMuted
    );
  }

  /**
   * Mutes all audio input devices.
   *
   * NOTE: Subsequently added input devices will not be muted by default.
   *
   * @return {void}
   */
  muteAllAudio() {
    return this._inputMediaDeviceFactoryCollection.muteAudio();
  }

  /**
   * Unmutes all audio input devices.
   *
   * @return {void}
   */
  unmuteAllAudio() {
    return this._inputMediaDeviceFactoryCollection.unmuteAudio();
  }
}
