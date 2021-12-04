import { useEffect } from "react";
import Full from "../Full";
import LED from "../LED";

import useServiceClass from "@hooks/useServiceClass";
import InputMediaDevicesService from "@services/InputMediaDevicesService";

export default function InputMediaDevices() {
  const { serviceInstance: inputMediaDevicesService } = useServiceClass(
    InputMediaDevicesService
  );

  useEffect(() => {
    if (inputMediaDevicesService) {
      inputMediaDevicesService.fetchAudioInputDevices();
    }
  }, [inputMediaDevicesService]);

  if (!inputMediaDevicesService) {
    return null;
  }

  const devices = inputMediaDevicesService.getMediaDevices();

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
                    onClick={() =>
                      !isCapturing
                        ? inputMediaDevicesService.captureSpecificAudioInputDevice(
                            device
                          )
                        : inputMediaDevicesService.uncaptureSpecificAudioInputDevice(
                            device
                          )
                    }
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
