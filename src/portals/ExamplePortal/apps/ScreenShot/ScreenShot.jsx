/*
import { EVT_DESTROYED } from "phantom-core";
import { useCallback, useEffect, useState } from "react";

import Layout, { Content, Footer, Row, Column } from "@components/Layout";
import Cover from "@components/Cover";
*/
import Center from "@components/Center";
// import { Video } from "@components/audioVideoRenderers";
// import LED from "@components/LED";

import ScreenCapturerService from "../../services/ScreenCapturerService";

// TODO: Include ability to screen record and snapshot

const ScreenShot = {
  id: "screen-shot",
  title: "Screen Shot",
  style: {
    right: 0,
    bottom: 0,
    width: 640 * 0.8,
    height: 480 * 0.8,
  },
  serviceClasses: [ScreenCapturerService],
  view: function View({ windowServices }) {
    return <Center>TODO: Implement</Center>;

    /*
    const scs = windowServices[ScreenCapturerService];

    // TODO: Document
    const handleStartScreenCapture = useCallback(
      async (constraints = {}, factoryOptions = {}) => {
        const factory = await scs.startScreenCapture(
          constraints,
          factoryOptions
        );

        setScreenCaptureFactory(factory);

        factory.once(EVT_DESTROYED, () => {
          setScreenCaptureFactory(null);
        });

        return factory;
      },
      [scs]
    );

    useEffect(() => {
      if (screenCaptureFactory) {
        return () => {
          screenCaptureFactory.destroy();
        };
      }
    }, [screenCaptureFactory]);

    // const mediaStreamTracks = scs.getMediaStreamTracks();
    // const isActive = Boolean(mediaStreamTracks.length)

    // TODO: Remove
    // logger.log({ mediaStreamTracks });

    const videoTrack = screenCaptureFactory
      ?.getVideoTrackControllers()[0]
      .getOutputTrack();

    return (
      <Layout style={{ backgroundColor: "#424242", color: "#999" }}>
        <Content>
          <Video mediaStreamTrack={videoTrack} />
          {!screenCaptureFactory && (
            <Cover>
              <Center>
                <div>
                  <button
                    onClick={() => handleStartScreenCapture()}
                    style={{
                      backgroundColor: "green",
                      width: 200,
                      height: 200,
                      borderRadius: 200,
                      fontWeight: "bold",
                      fontSize: "1.4rem",
                      border: "8px #ccc solid",
                    }}
                  >
                    Start Screen Capture
                  </button>
                </div>
              </Center>
            </Cover>
          )}
        </Content>
        <Footer>
          <Row>
            <Column>
              <Center>
                <LED color={screenCaptureFactory ? "green" : "gray"} />{" "}
                {screenCaptureFactory ? "Capturing" : "Not capturing"}
              </Center>
            </Column>
            <Column>
              <Center>
                <button
                  style={{
                    backgroundColor: !screenCaptureFactory ? "green" : "red",
                  }}
                  onClick={() => {
                    if (screenCaptureFactory) {
                      screenCaptureFactory.destroy();
                    } else {
                      handleStartScreenCapture();
                    }
                  }}
                >
                  {!screenCaptureFactory ? "Capture" : "Stop"}
                </button>
              </Center>
            </Column>
            <Column>
              <Center>
                <button disabled>Video Stats</button>
              </Center>
            </Column>
          </Row>
        </Footer>
      </Layout>
    );
    */
  },
};

export default ScreenShot;
