import Full from "../Full";
import Layout, { Header, Content, Footer } from "../Layout";
import Padding from "../Padding";
import Center from "../Center";
import Cover from "../Cover";

import RCACableIcon from "@icons/RCACableIcon";

import AudioInputDeviceTableRow from "./subComponents/AudioInputDeviceTableRow";

import useInputMediaDevicesSelectorState from "./subHooks/useInputMediaDevicesSelectorState";

// TODO: Document and add prop-types
// TODO: Refactor for all input device types
export default function InputMediaDevicesSelector({
  onDeviceCapture = device => null,
  onDeviceUncapture = device => null,
}) {
  const {
    inputMediaDevicesService,
    mediaDevicesCachingService,
    audioInputDevices,
    capturedAudioInputDevices,
    audioQualityPresets,
    toggleSpecificMediaDevice,
    setDevicePreferredAudioQualityPresetName,
    getDevicePreferredAudioQualityPresetName,
  } = useInputMediaDevicesSelectorState({
    onDeviceCapture,
    onDeviceUncapture,
  });

  if (!inputMediaDevicesService || !mediaDevicesCachingService) {
    return null;
  }

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

                  const mediaStreamTracks =
                    isCapturing &&
                    deviceCaptureFactory?.getOutputMediaStream()?.getTracks();

                  // TODO: Remove
                  const audioTrackController =
                    isCapturing &&
                    deviceCaptureFactory?.getAudioTrackControllers()[0];
                  if (audioTrackController) {
                    console.log({
                      settings: audioTrackController.getSettings(),
                    });
                  }

                  return (
                    <AudioInputDeviceTableRow
                      key={idx}
                      device={device}
                      mediaStreamTracks={mediaStreamTracks}
                      isCapturing={isCapturing}
                      onToggleCapture={() => toggleSpecificMediaDevice(device)}
                      audioQualityPresets={audioQualityPresets}
                      audioQualityPresetName={getDevicePreferredAudioQualityPresetName(
                        device
                      )}
                      onChangeAudioQualityPresetName={audioQualityPresetName =>
                        setDevicePreferredAudioQualityPresetName(
                          device,
                          audioQualityPresetName
                        )
                      }
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
