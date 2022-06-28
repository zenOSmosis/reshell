import { useEffect, useMemo, useState } from "react";
import Layout, { Content, Footer, Row, Column } from "@components/Layout";
import Full from "@components/Full";
import Cover from "@components/Cover";
import Animation from "@components/Animation";

import Padding from "@components/Padding";

import WooferAudioLevelMeter from "@components/audioMeters/WooferAudioLevelMeter";
import Speaker from "@components/Speaker";

import useWindowSize from "@hooks/useWindowSize";

const SMALL_WIDTH_THRESHOLD = 720;

export default function SoundSystemLayout({
  inputAudioMediaStreamTracks = [],
  incomingAudioMediaStreamTracks = [],
  children,
}) {
  const mergedAudioMediaStreamTracks = useMemo(
    () => [...inputAudioMediaStreamTracks, ...incomingAudioMediaStreamTracks],
    [inputAudioMediaStreamTracks, incomingAudioMediaStreamTracks]
  );

  const windowSize = useWindowSize();

  const [isSmallLayout, setIsSmallLayout] = useState(
    windowSize?.width < SMALL_WIDTH_THRESHOLD
  );

  const [transitionPhase, setTransitionPhase] = useState(0);

  // Automatically determine if small layout
  useEffect(() => {
    const nextIsSmallLayout = windowSize?.width < 820;

    if (isSmallLayout !== nextIsSmallLayout) {
      setIsSmallLayout(nextIsSmallLayout);
    }
  }, [isSmallLayout, windowSize]);

  return (
    <Full>
      <Cover>
        {
          // Big speaker intro view
        }
        <Animation
          animationName={transitionPhase === 0 ? "fadeIn" : "fadeOut"}
          onAnimationEnd={() => setTransitionPhase(1)}
        >
          <Padding>
            <Speaker />
          </Padding>
        </Animation>
      </Cover>
      <Cover>
        {transitionPhase === 1 && (
          <Animation animationName="fadeIn">
            <Layout>
              <Content>
                <Row>
                  <Column>{children}</Column>
                </Row>
              </Content>
              {/*
              windowSize.width < SMALL_WIDTH_THRESHOLD && (
                <Footer style={{ height: 100 }}>
                  <Padding>
                    <Row>
                      <Column>
                        <WooferAudioLevelMeter
                          mediaStreamTracks={mergedAudioMediaStreamTracks}
                        />
                      </Column>
                      <Column>
                        <WooferAudioLevelMeter
                          mediaStreamTracks={mergedAudioMediaStreamTracks}
                        />
                      </Column>
                      <Column>
                        <WooferAudioLevelMeter
                          mediaStreamTracks={mergedAudioMediaStreamTracks}
                        />
                      </Column>
                    </Row>
                  </Padding>
                </Footer>
              )
              */}
            </Layout>
          </Animation>
        )}
      </Cover>
    </Full>
  );
}
