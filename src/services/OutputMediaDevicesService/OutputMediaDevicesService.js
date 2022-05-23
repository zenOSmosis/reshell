import UIServiceCore from "@core/classes/UIServiceCore";
import OutputMediaStreamTrackCollection, {
  EVT_CHILD_INSTANCE_ADD,
  EVT_CHILD_INSTANCE_REMOVE,
} from "./OutputMediaStreamTrackCollection";

import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Audio } from "@components/audioVideoRenderers";

// TODO: Document
// NOTE: Most services should not utilize React directly, but this one does
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
            EVT_CHILD_INSTANCE_ADD,
            () => {
              setAudioMediaStreamTracks(
                this._outputMediaStreamTrackCollection.getOutputAudioMediaStreamTracks()
              );
            }
          );

          this._outputMediaStreamTrackCollection.on(
            EVT_CHILD_INSTANCE_REMOVE,
            () => {
              setAudioMediaStreamTracks(
                this._outputMediaStreamTrackCollection.getOutputAudioMediaStreamTracks()
              );
            }
          );

          // Perform initial sync
          setAudioMediaStreamTracks(
            this._outputMediaStreamTrackCollection.getOutputAudioMediaStreamTracks()
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
      this.registerCleanupHandler(() =>
        window.document.body.removeChild(audioDOMBase)
      );

      // FIXME: (jh) The following bug fix is likely due to the handling of
      // WindowManager itself.  Might need to circle back to the following
      // information later on for future improvements.
      //
      // IMPORTANT: The setImmediate wrap fixes an issue where starting this
      // service from a serviceClasses array in an app registration would
      // produce the following warning:
      //
      // "Render methods should be a pure function of props and state;
      // triggering nested component updates from render is not allowed. If
      // necessary, trigger nested updates in componentDidUpdate."
      //
      setImmediate(() =>
        ReactDOM.render(<OutputMediaDevicesAudio />, audioDOMBase)
      );
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
