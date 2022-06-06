import { useEffect, useState } from "react";
import Layout, {
  Header,
  Content,
  Footer,
  Row,
  Column,
} from "@components/Layout";
import Center from "@components/Center";
import Image from "@components/Image";
import Padding from "@components/Padding";

import WooferAudioLevelMeter from "@components/audioMeters/WooferAudioLevelMeter";

import useWindowSize from "@hooks/useWindowSize";

const SMALL_WIDTH_THRESHOLD = 720;
// const SMALL_HEIGHT_THRESHOLD =

// TODO: Active measure ReShell window size to determine if content should lay inside or on top of speakers
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

  // TODO: Refactor?
  /*
  return (
    <Layout>
      <Content>
        <Row>
          <Column
            style={{ maxWidth: "25%", border: "1px #ccc solid" }}
          ></Column>
          <Column>
            <Layout>
              <Content></Content>
              <Footer style={{ maxHeight: 100, textAlign: "center" }}>
                <Image src={ZenOSmosisLogo} />
              </Footer>
            </Layout>
          </Column>
          <Column
            style={{ maxWidth: "25%", border: "1px #ccc solid" }}
          ></Column>
        </Row>
      </Content>
    </Layout>
  );
  */
}
