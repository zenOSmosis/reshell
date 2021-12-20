import { useCallback, useEffect } from "react";
import Full from "../Full";
import Layout, { Header, Content } from "../Layout";
import Padding from "../Padding";
import Center from "../Center";
import LED from "../LED";
import AudioLevelMeter from "../audioMeters/AudioLevelMeter";

import useServiceClass from "@hooks/useServiceClass";
import InputMediaDevicesService from "@services/InputMediaDevicesService";

// TODO: Document and add prop-types
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
                  <td className="center">State</td>
                  <td className="center">Level</td>
                </tr>
              </thead>
              <tbody>
                {audioInputDevices.map((device, idx) => {
                  // TODO: Remove
                  // console.log({ device });

                  const isCapturing =
                    inputMediaDevicesService.getIsAudioMediaDeviceBeingCaptured(
                      device
                    );

                  const deviceCaptureFactory =
                    inputMediaDevicesService.getMediaDeviceCaptureFactory(
                      device
                    );

                  return (
                    <tr key={idx}>
                      <td>{device.label || `[Unknown Label]`}</td>
                      {/*
                        <td>{device.kind}</td>
                        */}

                      <td>
                        <button
                          onClick={() => toggleSpecificMediaDevice(device)}
                          style={{
                            backgroundColor: isCapturing ? "red" : "green",
                            width: "100%",
                          }}
                        >
                          {isCapturing ? "Stop" : "Start"}
                        </button>
                      </td>
                      <td className="center">
                        <LED color={isCapturing ? "green" : "gray"} />{" "}
                        {isCapturing ? "on" : "off"}
                      </td>
                      <td className="center">
                        {device.kind === "audioinput" && (
                          <AudioLevelMeter
                            style={{ height: 50 }}
                            mediaStreamTrack={
                              deviceCaptureFactory
                                ?.getOutputMediaStream()
                                ?.getTracks()[0]
                            }
                          />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Full>
        </Padding>
      </Content>
      {/*
        <Footer style={{ height: 50 }}>
          <Layout>
            <Header>Settings for the selected device...</Header>
            <Content>
              <input type="range" min="0" max="10" value="5" />
            </Content>
          </Layout>
        </Footer>
        */}
    </Layout>
  );
}
