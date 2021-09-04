import { useEffect, useState } from "react";
import Layout, { Content, Footer } from "@components/Layout";
import Center from "@components/Center";
import Desktop from "@components/Desktop";

import AudioLevelMeter from "@components/audioMeters/AudioLevelMeter";
import VUMeter from "@components/audioMeters/VUMeter";

import InputMediaDeviceSelectorView from "./views/InputMediaDeviceSelectorView";

// TODO: Update this
import {
  windowMonitor,
  EVT_UPDATED,
} from "@components/Window/classes/WindowController";

function WindowMonitorView() {
  const [lenWindows, setLenWindows] = useState(0);

  useEffect(() => {
    const _handleUpdate = () => {
      setLenWindows(windowMonitor.getChildren().length);
    };

    _handleUpdate();

    windowMonitor.on(EVT_UPDATED, _handleUpdate);

    return function unmount() {
      windowMonitor.off(EVT_UPDATED, _handleUpdate);
    };
  }, []);

  return (
    <div>
      Window Monitor<div>{lenWindows}</div>
    </div>
  );
}

export default function ExamplePortal() {
  return (
    <Desktop
      initialWindows={[
        {
          id: "test-vu-meter",
          title: "Test VU Meter",
          style: {
            left: 100,
            top: 80,
            width: 320,
            height: 320,
          },
          view: () => (
            <Center>
              <div>
                <VUMeter percent={0} />
                <AudioLevelMeter
                  style={{ marginLeft: 20, height: 160, width: 40 }}
                  percent={0}
                />
              </div>
              <div>
                <button>Start Microphone</button>
              </div>
            </Center>
          ),
        },

        {
          id: "window-monitor",
          title: "Window Monitor",
          style: {
            left: 30,
            top: 80,
            width: 320,
            height: 320,
          },
          view: () => <WindowMonitorView />,
        },

        {
          id: "media-input-selector",
          title: "Input Media Device Selector",
          style: {
            left: 90,
            top: 180,
            width: 640,
            height: 320,
          },
          view: () => <InputMediaDeviceSelectorView />,
        },

        {
          id: "about-reshell",
          title: "ReShell",
          style: {
            left: 100,
            top: 80,
            width: 640,
            height: 480,
          },
          view: () => (
            <Layout style={{ backgroundColor: "#424242", color: "#999" }}>
              <Content>
                <Center>
                  <div style={{ fontSize: "8rem", fontStyle: "italic" }}>
                    ReShell
                  </div>
                  <div style={{ fontSize: "1.5rem" }}>
                    An opinionated, paradigm-switching app mounter
                  </div>
                </Center>
              </Content>
              <Footer>
                <div style={{ padding: 4 }}>
                  If you are seeing this screen, ReShell is up and running. Get
                  started with{" "}
                  {
                    // TODO: Make link
                  }
                  <span
                    style={{ color: "orange", textDecoration: "underline" }}
                  >
                    wrapping your app with ReShell
                  </span>
                  .
                </div>
              </Footer>
            </Layout>
          ),
        },
      ]}
    />
  );

  /*
  return (
    <Layout style={{ backgroundColor: "#424242", color: "#999" }}>
      <Content>
        <Center>
          <div style={{ fontSize: "18.4vw", fontStyle: "italic" }}>ReShell</div>
          <div style={{ fontSize: "4vw" }}>
            An opinionated, paradigm-switching app mounter
          </div>
        </Center>
      </Content>
      <Footer>
        <div style={{ padding: 4 }}>
          If you are seeing this screen, ReShell is up and running. Get started
          with{" "}
          <a href="#" style={{ color: "orange" }}>
            wrapping your app with ReShell
          </a>
          .
        </div>
      </Footer>
    </Layout>
  );
  */
}
