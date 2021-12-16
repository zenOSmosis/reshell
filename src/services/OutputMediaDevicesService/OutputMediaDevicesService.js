import UIServiceCore from "@core/classes/UIServiceCore";
import OutputAudioMediaStreamTrackCollection, {
  EVT_CHILD_INSTANCE_ADDED,
  EVT_CHILD_INSTANCE_REMOVED,
} from "./OutputAudioMediaStreamTrackCollection";

import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Audio } from "@components/audioVideoRenderers";

// TODO: Document
export default class OutputMediaDevicesService extends UIServiceCore {
  constructor(...args) {
    super(...args);

    this.setTitle("Output Media Devices Service");

    this._outputAudioMediaStreamTrackCollection = this.bindCollectionClass(
      OutputAudioMediaStreamTrackCollection
    );

    // TODO: Refactor and document
    (() => {
      const audioMediaStreamTrackCollection = this.getCollectionInstance(
        OutputAudioMediaStreamTrackCollection
      );

      function OutputMediaDevicesAudioAudio() {
        const [audioMediaStreamTracks, setAudioMediaStreamTracks] = useState(
          []
        );

        // Handle track syncing
        useEffect(() => {
          audioMediaStreamTrackCollection.on(
            EVT_CHILD_INSTANCE_ADDED,
            phantomAudioWrapper => {
              // TODO: Remove
              console.log("added phantom audio wrapper", phantomAudioWrapper);

              setAudioMediaStreamTracks(
                audioMediaStreamTrackCollection
                  .getChildren()
                  .map(
                    phantomAudioWrapper =>
                      phantomAudioWrapper.__audioMediaStreamTrack
                  )
              );
            }
          );

          audioMediaStreamTrackCollection.on(
            EVT_CHILD_INSTANCE_REMOVED,
            phantomAudioWrapper => {
              // TODO: Remove
              console.log("removed phantom audio wrapper", phantomAudioWrapper);

              setAudioMediaStreamTracks(
                audioMediaStreamTrackCollection
                  .getChildren()
                  .map(
                    phantomAudioWrapper =>
                      phantomAudioWrapper.__audioMediaStreamTrack
                  )
              );
            }
          );
        }, []);

        // TODO: Remove
        console.log({
          audioMediaStreamTracks,
        });

        return (
          <React.Fragment>
            {audioMediaStreamTracks.map(track => {
              return <Audio key={track.id} mediaStreamTrack={track} />;
            })}
          </React.Fragment>
        );
      }

      const audioDOMBase = document.createElement("div");
      audioDOMBase.style.display = "hidden";

      window.document.body.appendChild(audioDOMBase);
      this.registerShutdownHandler(() =>
        window.document.body.removeChild(audioDOMBase)
      );

      ReactDOM.render(<OutputMediaDevicesAudioAudio />, audioDOMBase);
    })();
  }

  // TODO: Document
  addOutputMediaStreamTrack(mediaStreamTrack) {
    return this._outputAudioMediaStreamTrackCollection.addOutputMediaStreamTrack(
      mediaStreamTrack
    );
  }

  // TODO: Document
  removeOutputMediaStreamTrack(mediaStreamTrack) {
    return this._outputAudioMediaStreamTrackCollection.removeOutputMediaStreamTrack(
      mediaStreamTrack
    );
  }
}
