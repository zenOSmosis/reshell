import { EVT_DESTROY } from "phantom-core";
import { useCallback, useEffect, useMemo, useState } from "react";

import Layout, { Content, Footer, Row, Column } from "@components/Layout";
import Cover from "@components/Cover";
import Center from "@components/Center";
import { Video } from "@components/audioVideoRenderers";
import Padding from "@components/Padding";
import AppLinkButton from "@components/AppLinkButton";
import AudioLevelMeter from "@components/audioMeters/AudioLevelMeter";

import useGetIsUnmounting from "@hooks/useGetIsUnmounting";

import ScreenCapturerService from "@services/ScreenCapturerService";

import { REGISTRATION_ID as INPUT_MEDIA_DEVICES_REGISTRATION_ID } from "../InputMediaDevicesApp";

export const REGISTRATION_ID = "screen-capture-window";

// TODO: Include ability to screen record and take arbitrary snapshot from video feed (separate from ScreenShot app which is a one-time deal)

// TODO: Include ability to NOT show local screen capture monitor feedback

// TODO: Include ability to open multiple windows with a unique capture per window

const ScreenCaptureApp = {
  id: REGISTRATION_ID,
  title: "Screen Capture",
  style: {
    width: 640 * 0.8,
    height: 480 * 0.8,
  },
  serviceClasses: [ScreenCapturerService],
  view: function View({ appServices, windowController }) {
    const scs = appServices[ScreenCapturerService];

    /**
     * NOTE: This value is memoized because it shouldn't change during this
     * browsing session.
     *
     * @type {boolean}
     */
    const isScreenCaptureSupported = useMemo(
      () => scs.getIsScreenCaptureSupported(),
      [scs]
    );

    // Automatically close the window after a short duration if screen sharing
    // is not supported
    useEffect(() => {
      if (!isScreenCaptureSupported) {
        const autoCloseTimeout = window.setTimeout(
          windowController.destroy,
          3000
        );

        windowController.once(EVT_DESTROY, () =>
          window.clearTimeout(autoCloseTimeout)
        );
      }
    }, [isScreenCaptureSupported, windowController]);

    const [screenCaptureFactory, setScreenCaptureFactory] = useState(null);

    const getIsUnmounting = useGetIsUnmounting();

    // TODO: Document
    const handleStartScreenCapture = useCallback(
      async (constraints = {}, factoryOptions = {}) => {
        const factory = await scs.startScreenCapture(
          constraints,
          factoryOptions
        );

        setScreenCaptureFactory(factory);

        factory.once(EVT_DESTROY, () => {
          // Unmounting check fixes an issue where memory-leak error is
          // presented when closing the window with an active screen capture
          if (!getIsUnmounting()) {
            setScreenCaptureFactory(null);
          }
        });

        return factory;
      },
      [scs, getIsUnmounting]
    );

    // Stop the screen capture on unmount
    useEffect(() => {
      if (screenCaptureFactory) {
        return () => {
          if (!screenCaptureFactory.getHasDestroyStarted()) {
            screenCaptureFactory.destroy();
          }
        };
      }
    }, [screenCaptureFactory]);

    const videoTrack = screenCaptureFactory
      ?.getVideoTrackControllers()[0]
      ?.getOutputTrack();

    const audioTrack = screenCaptureFactory
      ?.getAudioTrackControllers()[0]
      ?.getOutputTrack();

    if (!isScreenCaptureSupported) {
      return (
        <Center>
          <div style={{ fontWeight: "bold" }}>
            Screen capture is not supported in this browser.
          </div>
        </Center>
      );
    }

    return (
      <Layout style={{ backgroundColor: "#424242", color: "#999" }}>
        <Content>
          <Row>
            <Column>
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
            </Column>
            <Column style={{ width: 50, maxWidth: 50 }}>
              {/**
               * Audio level monitoring.
               *
               * FIXME: (jh) This was originally set up for two-channel
               * support, with independent meters, and it will require the
               * audio track to be split into independent tracks in order to
               * function as desired.
               *
               * The current functionality should represent both channels as
               * a mono representation.
               */}
              <Row style={{ textAlign: "center" }}>
                <Column>
                  <Layout>
                    <Content>
                      <AudioLevelMeter mediaStreamTrack={audioTrack} />
                    </Content>
                    <Footer>Audio</Footer>
                  </Layout>
                </Column>
              </Row>
            </Column>
          </Row>
        </Content>
        <Footer>
          <Padding>
            <Row>
              <Column>
                <Center>
                  <AppLinkButton id={INPUT_MEDIA_DEVICES_REGISTRATION_ID} />
                </Center>
              </Column>
              <Column>
                <Center>
                  <button
                    style={{
                      backgroundColor: !screenCaptureFactory ? "green" : "red",
                      whiteSpace: "nowrap",
                    }}
                    onClick={() => {
                      if (
                        screenCaptureFactory &&
                        !screenCaptureFactory.getHasDestroyStarted()
                      ) {
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
            </Row>
          </Padding>
        </Footer>
      </Layout>
    );
  },
};

export default ScreenCaptureApp;
