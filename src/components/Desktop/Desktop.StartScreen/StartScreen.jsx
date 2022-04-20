import { useState } from "react";
import Full from "@components/Full";
import Cover from "@components/Cover";
import Center from "@components/Center";
import Layout, { Content, Footer } from "@components/Layout";
import Padding from "@components/Padding";
import Animation from "@components/Animation";
import LoadingSpinner from "@components/LoadingSpinner";

import zenOSmosisLogo from "@assets/zenOSmosis-Logo-2046x530@72.png";

import getCopyright from "@utils/getCopyright";

import usePreload from "@hooks/usePreload";
import { useEffect } from "react";

export default function StartScreen({ onExit }) {
  const { isPreloaded } = usePreload([zenOSmosisLogo]);

  const [isTransitionOut, setIsTransitionOut] = useState(false);

  useEffect(() => {
    if (isPreloaded) {
      let timeout = null;

      if (!isTransitionOut) {
        timeout = setTimeout(() => {
          setIsTransitionOut(true);
        }, 1500);
      } else {
        timeout = setTimeout(() => {
          onExit();
        }, 1000);
      }

      return () => clearTimeout(timeout);
    }
  }, [isPreloaded, isTransitionOut, onExit]);

  return (
    <Animation
      animationName={isTransitionOut && "fadeOut"}
      animationDuration="1s"
    >
      <Full style={{ backgroundColor: "rgba(0,0,0,.9)" }}>
        <Cover style={{ pointerEvents: "none" }}>
          <Layout>
            <Content>
              <Center>
                {isPreloaded ? (
                  <Animation animationName="fadeIn" animationDuration="2s">
                    <div>
                      <div>
                        {
                          // FIXME: (jh) Re-enable zenOSmosis logo
                        }
                        {/*
                          <img
                          src={zenOSmosisLogo}
                          style={{ width: "90%" }}
                          alt="zenOSmosis"
                        />
                          */}
                        <span style={{ fontSize: "4rem" }}>
                          The most useless demo ever.
                        </span>
                      </div>
                    </div>
                  </Animation>
                ) : (
                  <>
                    <div>
                      <LoadingSpinner />
                    </div>
                    <div>Starting</div>
                  </>
                )}
              </Center>
            </Content>
            <Footer style={{ textAlign: "center" }}>
              <Padding style={{ fontWeight: "bold" }}>{getCopyright()}</Padding>
            </Footer>
          </Layout>
        </Cover>
      </Full>
    </Animation>
  );
}
