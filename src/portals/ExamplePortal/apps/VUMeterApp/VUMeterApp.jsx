import InputMediaDevicesService from "@services/InputMediaDevicesService";

import Layout, { Content, Footer } from "@components/Layout";
import Center from "@components/Center";
import AudioLevelMeter from "@components/audioMeters/AudioLevelMeter";
import VULevelMeter from "@components/audioMeters/VUMeter";
import Padding from "@components/Padding";
import AppLinkButton from "@components/AppLinkButton";

import { REGISTRATION_ID as INPUT_MEDIA_DEVICES_REGISTRATION_ID } from "../InputMediaDevicesApp";

export const REGISTRATION_ID = "vu-meter";

const VUMeterApp = {
  id: REGISTRATION_ID,
  title: "VU Meter",
  style: {
    width: 360,
    height: 360,
    // backgroundColor: "rgba(0,0,0,.4)",
  },
  serviceClasses: [InputMediaDevicesService],
  view: ({ appServices }) => {
    const mds = appServices[InputMediaDevicesService];

    const captureFactories = mds.getCaptureFactories();
    // const isCapturing = Boolean(captureFactories.length);

    // TODO: Add labels / controls (or adapt this program to be something else
    // entirely)

    const mediaStreamTracks = captureFactories
      .map(factory =>
        factory
          .getAudioTrackControllers()
          .map(controller => controller.getOutputMediaStreamTrack())
      )
      .flat();

    return (
      <Layout>
        <Content>
          <Center canOverflow={true}>
            <div>
              <VULevelMeter mediaStreamTracks={mediaStreamTracks} />
              <AudioLevelMeter
                style={{ marginLeft: 20, height: 160, width: 40 }}
                mediaStreamTracks={mediaStreamTracks}
              />
            </div>
            {/*
              <div>
                <button
                  onClick={() => {
                    !isCapturing
                      ? mds.captureDefaultAudioInputDevice()
                      : captureFactories.forEach(factory => factory.destroy());
                  }}
                  style={{ backgroundColor: isCapturing ? "red" : null }}
                >
                  {!isCapturing ? "Start Microphone" : "Stop Capturing"}
                </button>
              </div>
              */}
          </Center>
        </Content>
        <Footer>
          <Padding>
            <AppLinkButton id={INPUT_MEDIA_DEVICES_REGISTRATION_ID} />
          </Padding>
        </Footer>
      </Layout>
    );
  },
};

export default VUMeterApp;
