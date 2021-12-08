import InputMediaDevicesService from "@services/InputMediaDevicesService";

import Layout, { Content, Footer } from "@components/Layout";
import Padding from "@components/Padding";
import AppLinkButton from "@components/AppLinkButton";
import InputMediaDevicesSelector from "@components/InputMediaDevicesSelector";

import { REGISTRATION_ID as VU_METER_REGISTRATION_ID } from "../VUMeter";
import { REGISTRATION_ID as SCREEN_CAPTURE_REGISTRATION_ID } from "../ScreenCapture";

export const REGISTRATION_ID = "input-media-devices";

const InputMediaDevicesApp = {
  id: REGISTRATION_ID,
  title: "Input Media Devices",
  style: {
    width: 640,
    height: 300,
  },
  serviceClasses: [InputMediaDevicesService],
  view: function View({ appServices }) {
    const mds = appServices[InputMediaDevicesService];

    return (
      <Padding>
        <Layout>
          <Content>
            <InputMediaDevicesSelector />
          </Content>
          <Footer>
            <button
              onClick={() => mds.fetchAudioInputDevices(true)}
              style={{ float: "right" }}
            >
              Refetch
            </button>

            <span className="button-group">
              <AppLinkButton id={VU_METER_REGISTRATION_ID} />
              <AppLinkButton id={SCREEN_CAPTURE_REGISTRATION_ID} />
            </span>
          </Footer>
        </Layout>
      </Padding>
    );
  },
};

export default InputMediaDevicesApp;
