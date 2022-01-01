import { useCallback, useEffect } from "react";

import useServiceClass from "@hooks/useServiceClass";
import InputMediaDevicesService from "@services/InputMediaDevicesService";
import MediaDeviceCachingService from "@services/MediaDeviceCachingService";

// TODO: Move into InputMediaDevicesService(?)
import { utils } from "media-stream-track-controller";
const { audioQualityPresets } = utils.constraints;

// TODO: Document
export default function useInputMediaDevicesSelectorState({
  onDeviceCapture = device => null,
  onDeviceUncapture = device => null,
}) {
  const { serviceInstance: inputMediaDevicesService } = useServiceClass(
    InputMediaDevicesService
  );

  const { serviceInstance: mediaDevicesCachingService } = useServiceClass(
    MediaDeviceCachingService
  );

  // Automatically fetch input media devices when component mounts
  useEffect(() => {
    if (inputMediaDevicesService) {
      inputMediaDevicesService.fetchInputMediaDevices();
    }
  }, [inputMediaDevicesService]);

  /**
   * @return {Promise<void>}
   */
  const setDevicePreferredAudioQualityPresetName = useCallback(
    async (device, audioQualityPresetName) => {
      // TODO: Use constant
      if (device.kind !== "audioinput") {
        console.warn(
          `Cannot set device preferred audio quality preset name for "${device.kind}" kind.  Expected audioinput kind.`
        );
        return;
      }

      const audioQualityPreset =
        utils.constraints.audioQualityPresets.getAudioQualityPresetWithName(
          audioQualityPresetName
        );

      return mediaDevicesCachingService.setMediaDeviceUserMetadata(device, {
        audioQualityPreset,
      });

      // TODO: Uncapture device (if being captured)
      // TODO: Re-capture device (using new audio constraints)
    },
    [mediaDevicesCachingService]
  );

  // FIXME: (jh) Constraint matching could be moved into the service level
  // instead
  /**
   * @return {Promise<void>}
   */
  const captureSpecificMediaDevice = useCallback(
    async device => {
      const deviceUserMetadata =
        mediaDevicesCachingService.getMediaDeviceUserMetadata(device);

      let preferredConstraints =
        deviceUserMetadata &&
        deviceUserMetadata.audioQualityPreset?.constraints;

      // TODO: Use constant for kind
      if (!preferredConstraints && device.kind === "audioinput") {
        preferredConstraints =
          audioQualityPresets.getAudioQualityPresetConstraints(
            audioQualityPresets.AUDIO_QUALITY_PRESET_TALK_RADIO
          );
      }

      // Start the capturing
      return inputMediaDevicesService.captureSpecificMediaDevice(
        device,
        preferredConstraints
        // FIXME: (jh) Use device title in factory options?
      );
    },
    [inputMediaDevicesService, mediaDevicesCachingService]
  );

  /**
   * @return {string}
   */
  const getDevicePreferredAudioQualityPresetName = useCallback(
    device => {
      const deviceUserMetadata =
        mediaDevicesCachingService.getMediaDeviceUserMetadata(device);

      if (deviceUserMetadata) {
        return deviceUserMetadata.audioQualityPreset?.name;
      }
    },
    [mediaDevicesCachingService]
  );

  // TODO: Document
  const toggleSpecificMediaDevice = useCallback(
    async device => {
      const isCapturing =
        inputMediaDevicesService.getIsAudioMediaDeviceBeingCaptured(device);

      if (!isCapturing) {
        // IMPORTANT: Using the local (non-service) version here, as it
        // utilizes the user constraint handling
        await captureSpecificMediaDevice(device);

        // UI callback
        onDeviceCapture(device);
      } else {
        // Stop the capturing
        await inputMediaDevicesService.uncaptureSpecificMediaDevice(device);

        // UI callback
        onDeviceUncapture(device);
      }
    },
    [
      inputMediaDevicesService,
      captureSpecificMediaDevice,
      onDeviceCapture,
      onDeviceUncapture,
    ]
  );

  const audioInputDevices =
    inputMediaDevicesService?.getAudioInputMediaDevices() || [];

  const capturedAudioInputDevices = audioInputDevices.filter(device =>
    inputMediaDevicesService?.getIsAudioMediaDeviceBeingCaptured(device)
  );

  return {
    inputMediaDevicesService,
    mediaDevicesCachingService,
    audioInputDevices,
    capturedAudioInputDevices,
    audioQualityPresets,
    toggleSpecificMediaDevice,
    setDevicePreferredAudioQualityPresetName,
    getDevicePreferredAudioQualityPresetName,
  };
}
