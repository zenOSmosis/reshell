import MediaDevicesService from "@services/MediaDevicesService";

import Layout, { Content, Footer } from "@components/Layout";
import Center from "@components/Center";
import { AudioMediaStreamTrackLevelMeter } from "@components/audioMeters/AudioLevelMeter";
import { AudioMediaStreamTrackLevelVUMeter } from "@components/audioMeters/VUMeter";
import Padding from "@components/Padding";
import AppLinkButton from "@components/AppLinkButton";

import { REGISTRATION_ID as INPUT_MEDIA_DEVICES_REGISTRATION_ID } from "../InputMediaDevices";

export const REGISTRATION_ID = "vu-meter";

const VUMeter = {
  id: REGISTRATION_ID,
  title: "VU Meter",
  style: {
    width: 360,
    height: 360,
    backgroundColor: "rgba(0,0,0,.4)",
  },
  serviceClasses: [MediaDevicesService],
  view: ({ appServices }) => {
    const mds = appServices[MediaDevicesService];

    const captureFactories = mds.getCaptureFactories();
    const isCapturing = Boolean(captureFactories.length);

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
              <AudioMediaStreamTrackLevelVUMeter
                mediaStreamTracks={mediaStreamTracks}
              />
              <AudioMediaStreamTrackLevelMeter
                style={{ marginLeft: 20, height: 160, width: 40 }}
                mediaStreamTracks={mediaStreamTracks}
              />
            </div>
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

export default VUMeter;
