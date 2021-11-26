import PhantomCore, { PhantomCollection } from "phantom-core";
import UIServiceCore from "@core/classes/UIServiceCore";

import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Audio } from "@components/audioVideoRenderers";

// TODO: Change to ES6 imports once PhantomCore supports package.json exports
// @see https://github.com/zenOSmosis/phantom-core/issues/98
const { EVT_CHILD_INSTANCE_ADDED, EVT_CHILD_INSTANCE_REMOVED } =
  PhantomCollection;

/*
import {
  MediaStreamTrackControllerFactory,
  utils,
} from "media-stream-track-controller";
*/

// TODO: Build out; ensuring added children are media device controller factories
// class OutputMediaDeviceFactoryCollection extends PhantomCollection {
// TODO: Ensure that added children are of MediaStreamTrackControllerFactory type
// }

class AudioMediaStreamTrackCollection extends PhantomCollection {
  /**
   * @return {Promise<void>}
   */
  async destroy() {
    await this.destroyAllChildren();

    super.destroy();
  }
}

export default class OutputMediaDevicesService extends UIServiceCore {
  constructor(...args) {
    super(...args);

    this.setTitle("Output Media Devices Service");

    // this.bindCollectionClass(OutputMediaDeviceFactoryCollection);

    this.bindCollectionClass(AudioMediaStreamTrackCollection);

    // TODO: Refactor and document
    (() => {
      const audioMediaStreamTrackCollection = this.getCollectionInstance(
        AudioMediaStreamTrackCollection
      );

      function OutputMediaDevicesAudioAudio({}) {
        const [audioMediaStreamTracks, setAudioMediaStreamTracks] = useState(
          []
        );

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

    // TODO: Refactor
    /*
    (() => {
      const outputFactoryCollection = this.getCollectionInstance(
        OutputMediaDeviceFactoryCollection
      );

      outputFactoryCollection.on(EVT_CHILD_INSTANCE_ADDED, factory => {
        // TODO: Remove
        console.log("factory added", factory);
      });

      outputFactoryCollection.on(EVT_CHILD_INSTANCE_REMOVED, factory => {
        // TODO: Remove
        console.log("factory removed", factory);
      });
    })();
    */
  }

  // TODO: Implement and document
  addOutputMediaStreamTrack(mediaStreamTrack, mediaStream) {
    // TODO: Remove
    console.log("TODO: Handle addOutputMediaStreamTrack", {
      mediaStreamTrack,
      mediaStream,
    });

    if (mediaStreamTrack.kind === "audio") {
      const audioMediaStreamTrackCollection = this.getCollectionInstance(
        AudioMediaStreamTrackCollection
      );

      if (
        !audioMediaStreamTrackCollection.getChildWithKey(mediaStreamTrack.id)
      ) {
        const phantomAudioWrapper = new PhantomCore();
        phantomAudioWrapper.__audioMediaStreamTrack = mediaStreamTrack;

        audioMediaStreamTrackCollection.addChild(phantomAudioWrapper);
      }
    }
  }

  // TODO: Implement and document
  removeOutputMediaStreamTrack(mediaStreamTrack, mediaStream) {
    // TODO: Remove
    console.log("TODO: Handle removeOutputMediaStreamTrack", {
      mediaStreamTrack,
      mediaStream,
    });

    if (mediaStreamTrack.kind === "audio") {
      const audioMediaStreamTrackCollection = this.getCollectionInstance(
        AudioMediaStreamTrackCollection
      );

      const phantomAudioWrapper =
        audioMediaStreamTrackCollection.getChildWithKey(mediaStreamTrack.id);

      if (phantomAudioWrapper) {
        phantomAudioWrapper.destroy();
      }
    }
  }

  // TODO: Document and build out
  /*
  addOutputFactory(factory) {
    const outputFactoryCollection = this.getCollectionInstance(
      OutputMediaDeviceFactoryCollection
    );

    outputFactoryCollection.addChild(factory);
  }
  */

  // TODO: Document and build out
  /*
  removeOutputFactory(factory) {
    const outputFactoryCollection = this.getCollectionInstance(
      OutputMediaDeviceFactoryCollection
    );

    outputFactoryCollection.removeChild(factory);
  }
  */
}
