import MediaDevicesService from "@services/MediaDevicesService";

import Layout, { Content, Footer } from "@components/Layout";
import LED from "@components/LED";
import Padding from "@components/Padding";
import AppLinkButton from "@components/AppLinkButton";

import { REGISTRATION_ID as VU_METER_REGISTRATION_ID } from "../VUMeter";

export const REGISTRATION_ID = "input-media-devices";

const InputMediaDevices = {
  id: REGISTRATION_ID,
  title: "Input Media Devices",
  style: {
    width: 640,
    height: 300,
  },
  serviceClasses: [MediaDevicesService],
  view: function View({ appServices }) {
    const mds = appServices[MediaDevicesService];

    const mediaDevices = mds.getMediaDevices();

    return (
      <Padding>
        <Layout>
          <Content>
            <div style={{ width: "100%", height: "100%", overflowY: "auto" }}>
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
                  {mediaDevices.map((device, idx) => {
                    const isCapturing =
                      mds.getIsAudioMediaDeviceBeingCaptured(device);

                    return (
                      <tr key={idx}>
                        <td>{device.label || `[Unknown Label]`}</td>
                        <td className="center">{device.kind}</td>
                        <td className="center">
                          <button
                            onClick={() =>
                              !isCapturing
                                ? mds.captureSpecificAudioInputDevice(device)
                                : mds.uncaptureSpecificAudioInputDevice(device)
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
            </div>
          </Content>
          <Footer>
            <AppLinkButton id={VU_METER_REGISTRATION_ID} />
            <button
              onClick={() => mds.fetchAudioInputDevices(true)}
              style={{ float: "right" }}
            >
              Refetch
            </button>
          </Footer>
        </Layout>
      </Padding>
    );
  },
};

export default InputMediaDevices;
