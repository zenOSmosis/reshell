import MediaDevicesService from "@services/MediaDevicesService";

import Center from "@components/Center";
import { AudioMediaStreamTrackLevelMeter } from "@components/audioMeters/AudioLevelMeter";
import { AudioMediaStreamTrackLevelVUMeter } from "@components/audioMeters/VUMeter";

const TestVUMeterWindow = {
  id: "test-vu-meter",
  title: "Test VU Meter",
  style: {
    width: 320,
    height: 320,
    backgroundColor: "transparent",
  },
  serviceClasses: [MediaDevicesService],
  view: ({ windowServices }) => {
    const mds = windowServices[MediaDevicesService];

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
      <Center>
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
    );
  },
};

export default TestVUMeterWindow;
