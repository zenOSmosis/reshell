import UIServiceCore from "@core/classes/UIServiceCore";
import OutputMediaStreamTrackCollection, {
  EVT_CHILD_INSTANCE_ADDED,
  EVT_CHILD_INSTANCE_REMOVED,
} from "./OutputMediaStreamTrackCollection";

import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Audio } from "@components/audioVideoRenderers";

// TODO: Document
export default class OutputMediaDevicesService extends UIServiceCore {
  constructor(...args) {
    super(...args);

    this.setTitle("Output Media Devices Service");

    this._outputMediaStreamTrackCollection = this.bindCollectionClass(
      OutputMediaStreamTrackCollection
    );

    // TODO: Refactor and document
    (() => {
      const OutputMediaDevicesAudio = () => {
        const [audioMediaStreamTracks, setAudioMediaStreamTracks] = useState(
          []
        );

        // Handle track syncing
        useEffect(() => {
          this._outputMediaStreamTrackCollection.on(
            EVT_CHILD_INSTANCE_ADDED,
            () => {
              setAudioMediaStreamTracks(
                this._outputMediaStreamTrackCollection.getOutputAudioMediaStreamTracks()
              );
            }
          );

          this._outputMediaStreamTrackCollection.on(
            EVT_CHILD_INSTANCE_REMOVED,
            () => {
              setAudioMediaStreamTracks(
                this._outputMediaStreamTrackCollection.getOutputAudioMediaStreamTracks()
              );
            }
          );
        }, []);

        return (
          <React.Fragment>
            {audioMediaStreamTracks.map(track => {
              return <Audio key={track.id} mediaStreamTrack={track} />;
            })}
          </React.Fragment>
        );
      };

      const audioDOMBase = document.createElement("div");
      audioDOMBase.style.display = "hidden";

      window.document.body.appendChild(audioDOMBase);
      this.registerShutdownHandler(() =>
        window.document.body.removeChild(audioDOMBase)
      );

      ReactDOM.render(<OutputMediaDevicesAudio />, audioDOMBase);
    })();
  }

  // TODO: Document
  addOutputMediaStreamTrack(mediaStreamTrack) {
    return this._outputMediaStreamTrackCollection.addOutputMediaStreamTrack(
      mediaStreamTrack
    );
  }

  // TODO: Document
  removeOutputMediaStreamTrack(mediaStreamTrack) {
    return this._outputMediaStreamTrackCollection.removeOutputMediaStreamTrack(
      mediaStreamTrack
    );
  }

  /**
   * @return {MediaStreamTrack[]}
   */
  getOutputMediaStreamTracks() {
    return this._outputMediaStreamTrackCollection.getOutputMediaStreamTracks();
  }

  /**
   * @return {MediaStreamTrack[]}
   */
  getOutputAudioMediaStreamTracks() {
    return this._outputMediaStreamTrackCollection.getOutputAudioMediaStreamTracks();
  }

  /**
   * @return {MediaStreamTrack[]}
   */
  getOutputVideoMediaStreamTracks() {
    return this._outputMediaStreamTrackCollection.getOutputVideoMediaStreamTracks();
  }
}
