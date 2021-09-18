import { EVT_DESTROYED } from "phantom-core";
import { useCallback, useEffect, useState } from "react";

import Layout, { Content } from "@components/Layout";
import Cover from "@components/Cover";
import Center from "@components/Center";
import { Video } from "@components/audioVideoRenderers";

import ScreenCapturerService from "../../services/ScreenCapturerService";

// TODO: Remove
const PROTOWindows10 = {
  id: "proto-windows-10",
  title: "Windows 10",
  style: {
    right: 0,
    bottom: 0,
    width: 640 * 0.8,
    height: 480 * 0.8,
  },
  serviceClasses: [ScreenCapturerService],
  view: function View({ windowServices }) {
    const scs = windowServices[ScreenCapturerService];

    const [screenCaptureFactory, setScreenCaptureFactory] = useState(null);

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
      </Layout>
    );
  },
};

export default PROTOWindows10;
