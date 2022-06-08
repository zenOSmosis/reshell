import { useEffect, useState } from "react";
import Layout, { Content, Footer, Row, Column } from "@components/Layout";

import Padding from "@components/Padding";

import WooferAudioLevelMeter from "@components/audioMeters/WooferAudioLevelMeter";

import useWindowSize from "@hooks/useWindowSize";

const SMALL_WIDTH_THRESHOLD = 720;

export default function SoundSystemLayout({
  inputAudioMediaStreamTracks = [],
  children,
}) {
  const windowSize = useWindowSize();

  const [isSmallLayout, setIsSmallLayout] = useState(
    windowSize?.width < SMALL_WIDTH_THRESHOLD
  );

  // Automatically determine if small layout
  useEffect(() => {
    const nextIsSmallLayout = windowSize?.width < 820;

    if (isSmallLayout !== nextIsSmallLayout) {
      setIsSmallLayout(nextIsSmallLayout);
    }
  }, [isSmallLayout, windowSize]);

  return (
    <Layout>
      <Content>
        <Row>
          {windowSize.width >= SMALL_WIDTH_THRESHOLD && (
            <Column style={{ maxWidth: "20%" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  maxHeight: "100%",
                  maxWidth: "100%",
                  padding: 20,
                }}
              >
                <WooferAudioLevelMeter
                  mediaStreamTracks={inputAudioMediaStreamTracks}
                />
                <div style={{ height: 40 }} />
                <WooferAudioLevelMeter
                  mediaStreamTracks={inputAudioMediaStreamTracks}
                />
                <div style={{ height: 40 }} />
                <WooferAudioLevelMeter
                  mediaStreamTracks={inputAudioMediaStreamTracks}
                />
              </div>
            </Column>
          )}

          <Column>{children}</Column>

          {windowSize.width >= SMALL_WIDTH_THRESHOLD && (
            <Column style={{ maxWidth: "20%" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  maxHeight: "100%",
                  maxWidth: "100%",
                  padding: 20,
                }}
              >
                <WooferAudioLevelMeter
                  mediaStreamTracks={inputAudioMediaStreamTracks}
                />
                <div style={{ height: 40 }} />
                <WooferAudioLevelMeter
                  mediaStreamTracks={inputAudioMediaStreamTracks}
                />
                <div style={{ height: 40 }} />
                <WooferAudioLevelMeter
                  mediaStreamTracks={inputAudioMediaStreamTracks}
                />
              </div>
            </Column>
          )}
        </Row>
      </Content>
      {windowSize.width < SMALL_WIDTH_THRESHOLD && (
        <Footer style={{ height: 100 }}>
          <Padding>
            <Row>
              <Column>
                <WooferAudioLevelMeter
                  mediaStreamTracks={inputAudioMediaStreamTracks}
                />
              </Column>
              <Column>
                <WooferAudioLevelMeter
                  mediaStreamTracks={inputAudioMediaStreamTracks}
                />
              </Column>
              <Column>
                <WooferAudioLevelMeter
                  mediaStreamTracks={inputAudioMediaStreamTracks}
                />
              </Column>
            </Row>
          </Padding>
        </Footer>
      )}
    </Layout>
  );
}
