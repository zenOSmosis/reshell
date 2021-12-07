import { useCallback, useEffect } from "react";
import Full from "../Full";
import LED from "../LED";
import Center from "../Center";

import useServiceClass from "@hooks/useServiceClass";
import InputMediaDevicesService from "@services/InputMediaDevicesService";

export default function InputMediaDevices({
  onDeviceCapture = device => null,
  onDeviceUncapture = device => null,
}) {
  const { serviceInstance: inputMediaDevicesService } = useServiceClass(
    InputMediaDevicesService
  );

  // Automatically fetch input media devices when component mounts
  useEffect(() => {
    if (inputMediaDevicesService) {
      inputMediaDevicesService.fetchAudioInputDevices();
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

  const devices = inputMediaDevicesService.getMediaDevices();
  const isFetching = inputMediaDevicesService.getIsFetchingMediaDevices();

  if (!devices.length) {
    return (
      <Center style={{ fontWeight: "bold" }}>
        {isFetching
          ? "Fetching media devices..."
          : "No input media devices are currently available."}
      </Center>
    );
  }

  return (
    <Full style={{ overflowY: "auto" }}>
      <table style={{ width: "100%" }}>
        <thead>
          <tr>
            <td>Label</td>
            <td>Kind</td>
            <td>f(x)</td>
            <td>State</td>
          </tr>
        </thead>
        <tbody>
          {devices.map((device, idx) => {
            const isCapturing =
              inputMediaDevicesService.getIsAudioMediaDeviceBeingCaptured(
                device
              );

            return (
              <tr key={idx}>
                <td>{device.label || `[Unknown Label]`}</td>
                <td className="center">{device.kind}</td>
                <td className="center">
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
              </tr>
            );
          })}
        </tbody>
      </table>
    </Full>
  );
}
