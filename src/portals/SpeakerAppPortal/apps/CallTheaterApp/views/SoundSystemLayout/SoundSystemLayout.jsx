import { useEffect } from "react";
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

import ZenOSmosisLogo from "@assets/zenOSmosis-Logo-2046x530@72.png";

import useWindowSize from "@hooks/useWindowSize";

// TODO: Active measure ReShell window size to determine if content should lay inside or on top of speakers
export default function SoundSystemLayout({
  inputAudioMediaStreamTracks = [],
  children,
}) {
  const windowSize = useWindowSize();

  useEffect(() => {
    // TODO: Remove
    console.log({ windowSize });
  }, [windowSize]);

  return (
    <Row>
      <Column>
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
      <Column>{children}</Column>
      <Column>
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
    </Row>
  );

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
}
