import { useEffect, useState } from "react";
import LED from "../../../components/LED";

import { utils } from "media-stream-track-controller";

export default function InputMediaDeviceSelectorView() {
  const [inputMediaDevices, _setInputMediaDevices] = useState([]);

  useEffect(() => {
    utils
      .fetchMediaDevices(true)
      .then(utils.fetchMediaDevices.filterInputMediaDevices)
      .then((devices) => _setInputMediaDevices(devices))
      // TODO: Handle
      .catch((err) => console.error(err));
  }, []);

  // TODO: When pressing capture, open a new window with the device being captured

  return (
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
        {inputMediaDevices.map((device, idx) => (
          <tr key={idx}>
            <td>{device.label || `[Unknown Label]`}</td>
            <td className="center">{device.kind}</td>
            <td className="center">
              <button>Capture</button>
              <button>Test</button>
            </td>
            <td className="center">
              <LED color="gray" /> off
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
