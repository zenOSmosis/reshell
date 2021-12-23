import { useCallback, useEffect } from "react";
import Full from "../Full";
import Layout, { Header, Content, Footer } from "../Layout";
import Padding from "../Padding";
import Center from "../Center";
import Cover from "../Cover";

import RCACableIcon from "@icons/RCACableIcon";

import AudioInputDeviceTableRow from "./subComponents/AudioInputDeviceTableRow";

import useServiceClass from "@hooks/useServiceClass";
import InputMediaDevicesService from "@services/InputMediaDevicesService";

// TODO: Move into InputMediaDevicesService(?)
import { utils } from "media-stream-track-controller";
const { audioQualityPresets } = utils.constraints;

// TODO: Document and add prop-types
// TODO: Refactor for all input device types
export default function InputMediaDevicesSelector({
  onDeviceCapture = device => null,
  onDeviceUncapture = device => null,
}) {
  const { serviceInstance: inputMediaDevicesService } = useServiceClass(
    InputMediaDevicesService
  );

  // Automatically fetch input media devices when component mounts
  useEffect(() => {
    if (inputMediaDevicesService) {
      inputMediaDevicesService.fetchInputMediaDevices();
    }
  }, [inputMediaDevicesService]);

  // TODO: Document
  const toggleSpecificMediaDevice = useCallback(
    async device => {
      const isCapturing =
        inputMediaDevicesService.getIsAudioMediaDeviceBeingCaptured(device);

      if (!isCapturing) {
        await inputMediaDevicesService.captureSpecificAudioInputDevice(device);

        onDeviceCapture(device);
      } else {
        inputMediaDevicesService.uncaptureSpecificAudioInputDevice(device);

        onDeviceUncapture(device);
      }
    },
    [inputMediaDevicesService, onDeviceCapture, onDeviceUncapture]
  );

  if (!inputMediaDevicesService) {
    return null;
  }

  const audioInputDevices =
    inputMediaDevicesService.getAudioInputMediaDevices();

  const lenAudioInputDevices = audioInputDevices.length;

  const isFetching = inputMediaDevicesService.getIsFetchingMediaDevices();

  if (!audioInputDevices.length) {
    return (
      <Center style={{ fontWeight: "bold" }}>
        {isFetching
          ? "Fetching audio devices..."
          : "No audio input devices are currently available."}
      </Center>
    );
  }

  const capturedAudioInputDevices = audioInputDevices.filter(
    inputMediaDevicesService.getIsAudioMediaDeviceBeingCaptured
  );

  const lenCapturedAudioInputDevices = capturedAudioInputDevices.length;

  return (
    <Layout>
      <Header>Select device(s) for sound input:</Header>
      <Content>
        <Padding>
          <Full
            style={{
              overflowY: "auto",
              border: "4px #22668F solid",
              borderRadius: 4,
            }}
          >
            <table style={{ width: "100%" }}>
              <thead>
                <tr>
                  <td>Name</td>
                  {/*
                    <td>Kind</td>
                    */}

                  <td className="center">f(x)</td>
                  <td className="center">Level</td>
                </tr>
              </thead>
              <tbody>
                {audioInputDevices.map((device, idx) => {
                  // TODO: Remove
                  // console.log({ device });

                  const isCapturing =
                    capturedAudioInputDevices.includes(device);

                  const deviceCaptureFactory =
                    inputMediaDevicesService.getMediaDeviceCaptureFactory(
                      device
                    );

                  const mediaStreamTrack =
                    isCapturing &&
                    deviceCaptureFactory
                      ?.getOutputMediaStream()
                      ?.getTracks()[0];

                  const audioTrackController =
                    isCapturing &&
                    deviceCaptureFactory?.getAudioTrackControllers()[0];

                  // TODO: Remove
                  if (audioTrackController) {
                    console.log({
                      settings: audioTrackController.getSettings(),
                    });
                  }

                  /*
                  const audioQualityPresetName =
                    audioTrackController &&
                    audioTrackController.getMatchedAudioQualityPreset()?.name;

                  /*
                  const isNoiseSuppressionEnabled =
                    audioTrackController &&
                    audioTrackController.getIsNoiseSuppressionEnabled();
                  const isEchoCancellationEnabled =
                    audioTrackController &&
                    audioTrackController.getIsEchoCancellationEnabled();
                  const isAutoGainControlEnabled =
                    audioTrackController &&
                    audioTrackController.getIsAutoGainControlEnabled();
                    */

                  // TODO: Remove
                  /*
                  console.log({
                    audioTrackController,
                    isNoiseSuppressionEnabled,
                    isEchoCancellationEnabled,
                    isAutoGainControlEnabled,
                  });
                  */

                  return (
                    <AudioInputDeviceTableRow
                      key={idx}
                      device={device}
                      mediaStreamTrack={mediaStreamTrack}
                      isCapturing={isCapturing}
                      onToggleCapture={() => toggleSpecificMediaDevice(device)}
                      audioQualityPresets={audioQualityPresets}
                      // audioQualityPresetName={audioQualityPresetName}
                      // onChangeAudioQualityPresetName={}
                      /*
                      isNoiseSuppressionEnabled={isNoiseSuppressionEnabled}
                      onToggleNoiseSuppression={isEnabled =>
                        audioTrackController &&
                        audioTrackController.setIsNoiseSuppressionEnabled(
                          isEnabled
                        )
                      }
                      isEchoCancellationEnabled={isEchoCancellationEnabled}
                      onToggleEchoCancellation={isEnabled =>
                        audioTrackController &&
                        audioTrackController.setIsEchoCancellationEnabled(
                          isEnabled
                        )
                      }
                      isAutoGainControlEnabled={isAutoGainControlEnabled}
                      onToggleAutoGainControl={isEnabled =>
                        audioTrackController &&
                        audioTrackController.setIsAutoGainControlEnabled(
                          isEnabled
                        )
                      }
                      */
                    />
                  );
                })}
              </tbody>
            </table>
          </Full>
        </Padding>
      </Content>

      <Footer style={{ minHeight: 50 }}>
        <Padding>
          <RCACableIcon
            style={{
              fontSize: 38,
              marginLeft: 20,
              color: "rgba(255,255,255,.2)",
            }}
          />
          <Cover>
            <Center>
              <div>
                {lenAudioInputDevices} audio input device
                {lenAudioInputDevices !== 1 && "s"} available.
              </div>
              <div>
                {lenCapturedAudioInputDevices} audio input device
                {lenCapturedAudioInputDevices !== 1 && "s"} currently being
                captured.
              </div>
            </Center>
          </Cover>
        </Padding>
      </Footer>
    </Layout>
  );
}
