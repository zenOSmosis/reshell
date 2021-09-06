import Layout, { Content, Footer, Row, Column } from "@components/Layout";
import Cover from "@components/Cover";
import Center from "@components/Center";
import { Video } from "@components/audioVideoRenderers";
import LED from "@components/LED";

import ScreenCapturerService from "../services/ScreenCapturerService";

const ScreenCaptureWindow = {
  id: "screen-capture-window",
  title: "Screen Capture",
  style: {
    right: 0,
    bottom: 0,
    width: 640 * 0.8,
    height: 480 * 0.8,
  },
  serviceClasses: [ScreenCapturerService],
  view: function View({ windowServices, logger }) {
    const scs = windowServices[ScreenCapturerService];

    const mediaStreamTracks = scs.getMediaStreamTracks();
    // const isActive = Boolean(mediaStreamTracks.length)

    // TODO: Remove
    // logger.log({ mediaStreamTracks });

    return (
      <Layout style={{ backgroundColor: "#424242", color: "#999" }}>
        <Content>
          <Video />
          <Cover>
            <Center>
              <div>
                <button
                  onClick={() => scs.startScreenCapture()}
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
        </Content>
        <Footer>
          <Row>
            <Column>
              <Center>
                <LED color="gray" /> Not capturing
              </Center>
            </Column>
            <Column>
              <Center>
                <input type="checkbox" /* checked */ />{" "}
                <span>Show Monitor</span>
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
  },
};

export default ScreenCaptureWindow;
