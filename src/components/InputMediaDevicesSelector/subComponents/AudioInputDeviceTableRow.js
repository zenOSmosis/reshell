import Padding from "@components/Padding";
import LED from "@components/LED";
import AudioLevelMeter from "@components/audioMeters/AudioLevelMeter";
import NoWrap from "@components/NoWrap";
import Center from "@components/Center";

// TODO: Document and add prop-types
export default function AudioInputDeviceTableRow({
  device,
  mediaStreamTracks,
  isCapturing,
  onToggleCapture,
  audioQualityPresets,
  audioQualityPresetName,
  onChangeAudioQualityPresetName,
}) {
  // TODO: Use constant for check type
  if (device.kind !== "audioinput") {
    throw new TypeError("device is not an audioinput device");
  }

  return (
    <tr style={isCapturing ? { backgroundColor: "rgba(0,174,255,.2)" } : null}>
      <td>
        <Padding>
          <NoWrap style={{ fontWeight: "bold" }}>
            {device.label || `[Unknown Label]`}
          </NoWrap>

          <div style={{ marginTop: 4 }}>
            Quality:{" "}
            <select
              value={audioQualityPresetName}
              onChange={evt => onChangeAudioQualityPresetName(evt.target.value)}
              // FIXME: (jh) Due to issues with dynamically changing
              // constraints while a media device is capturing in Chromium-
              // based browsers, along with issues with WebRTCPeer / ZenRTCPeer
              // not seeming to handle rapid track unpublishing / republishing,
              // it seems better to force the user to have to stop the media
              // device capturing before changing the preferred audio quality
              // settings
              disabled={isCapturing}
            >
              {audioQualityPresets.map((preset, idx) => {
                const presetName = preset.name;

                return (
                  <option key={idx} value={presetName}>
                    {presetName}
                  </option>
                );
              })}
            </select>
          </div>
        </Padding>
      </td>

      <td>
        <Padding>
          <div className="center">
            <button
              onClick={onToggleCapture}
              style={{
                backgroundColor: isCapturing ? "red" : "green",
                width: "100%",
              }}
            >
              {isCapturing ? "Stop" : "Start"}
            </button>
          </div>
          <div style={{ textAlign: "center", marginTop: 4 }}>
            <LED color={isCapturing ? "green" : "gray"} />{" "}
            {isCapturing ? "on" : "off"}
          </div>
        </Padding>
      </td>
      <td
        className="center"
        style={{
          width: 80,
          // NOTE: This height cascades down to the audio level meter and helps
          // keep the row height consistent regardless of whether the meter is
          // active or not
          height: 70,
        }}
      >
        <Padding>
          {isCapturing ? (
            device.kind === "audioinput" && (
              <AudioLevelMeter mediaStreamTracks={mediaStreamTracks} />
            )
          ) : (
            <Center style={{ color: "gray" }}>N/A</Center>
          )}
        </Padding>
      </td>
    </tr>
  );
}
