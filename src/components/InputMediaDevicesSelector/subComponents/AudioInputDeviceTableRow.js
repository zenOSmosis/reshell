import Padding from "@components/Padding";
import ButtonTransparent from "@components/ButtonTransparent";
import Center from "@components/Center";
import AudioLevelMeter from "@components/audioMeters/AudioLevelMeter";

import MicrophoneIcon from "@icons/MicrophoneIcon";
import CloseIcon from "@icons/CloseIcon";

// TODO: Document and add prop-types
export default function AudioInputDeviceTableRow({
  device,
  mediaStreamTracks,
  isCapturing,
  onToggleCapture,
  isMuted,
  onToggleMute,
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
          <div style={{ fontWeight: "bold" }}>
            {device.label || `[Unknown Label]`}
          </div>

          <div style={{ marginTop: 4 }}>
            <span style={{ fontSize: ".7em" }}>Quality:</span>{" "}
            {!isCapturing ? (
              <select
                value={audioQualityPresetName}
                onChange={evt =>
                  onChangeAudioQualityPresetName(evt.target.value)
                }
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
            ) : (
              <button
                onClick={onToggleCapture}
                style={{ minWidth: 145, textAlign: "left" }}
              >
                {audioQualityPresetName}{" "}
                <CloseIcon style={{ color: "orange", float: "right" }} />
              </button>
            )}
          </div>
        </Padding>
      </td>

      <td className="center">
        <Padding>
          <button
            onClick={onToggleCapture}
            style={{
              backgroundColor: isCapturing ? "red" : "#347FE8",
              width: "100%",
            }}
          >
            {isCapturing ? "Stop" : "Start"}
          </button>
        </Padding>
      </td>
      <td className="center">
        <Padding>
          <ButtonTransparent
            disabled={!isCapturing}
            onClick={onToggleMute}
            style={{
              color: !isCapturing ? "inherit" : isMuted ? "white" : "orange",
            }}
          >
            <div style={{ textAlign: "center" }}></div>
            <MicrophoneIcon style={{ fontSize: "1.5em" }} />
            <div style={{ fontSize: ".7em", marginTop: 4 }}>
              {!isCapturing ? "N/A" : isMuted ? "Yes" : "No"}
            </div>
          </ButtonTransparent>
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
            <Center style={{ color: "gray", fontSize: ".7em" }}>Off</Center>
          )}
        </Padding>
      </td>
    </tr>
  );
}
