import { useState } from "react";
import Layout, { Content, Footer, Row, Column } from "@components/Layout";
import Cover from "@components/Cover";
import Center from "@components/Center";

import demoSlides from "./demo.slides";

// TODO: Add image scaler for slides
// TODO: Fix issue (globally) where mobile cannot scroll windows with fingers (ensure Safari iOS doesn't page bounce)
// TODO: Include optional slide titles

const PresentationExpress = {
  id: "presentation-express",
  title: "Presentation Express",
  style: {
    left: "auto",
    bottom: 0,
    width: 640 * 1.5,
    height: 480 * 1.5,
  },
  view: function View() {
    const [slideIdx, setSlideIdx] = useState(0);
    const [areThumbnailsEnabled, setAreThumbnailsEnabled] = useState(false);

    const SlideView = demoSlides[slideIdx].view;

    return (
      <Layout>
        <Row>
          <Column
            style={{
              maxWidth: 150,
              backgroundColor: "rgba(255, 255,255,.4)",
              textAlign: "center",
            }}
          >
            {
              // TODO: Bump scroll position if user scrolls from outside (after doing so, consider making a separate component for the functionality)
            }
            <div style={{ width: "100%", height: "100%", overflow: "auto" }}>
              {demoSlides.map((slide, idx) => {
                const { view: SlideView } = slide;

                const isSelected = idx === slideIdx;

                return (
                  <div
                    key={idx}
                    style={{
                      width: "90%",
                      height: 80,
                      backgroundColor: "rgba(0,0,0,.4)",
                      display: "inline-block",
                      margin: "10px auto",
                      border: `1px ${isSelected ? "red" : "black"} solid`,
                      position: "relative",
                    }}
                  >
                    <Cover>
                      {areThumbnailsEnabled ? (
                        <SlideView />
                      ) : (
                        <Center>Slide {idx + 1}</Center>
                      )}
                    </Cover>
                    <Cover>
                      {
                        // TODO: Use transparent button component
                      }
                      <button
                        onClick={() => setSlideIdx(idx)}
                        style={{
                          width: "100%",
                          height: "100%",
                          backgroundColor: "transparent",
                        }}
                      ></button>
                    </Cover>
                  </div>
                );
              })}
            </div>
          </Column>
          <Column>
            <Layout>
              <Content>
                <SlideView />
              </Content>
              <Footer style={{ textAlign: "right" }}>
                <button
                  style={{ float: "left" }}
                  onClick={() => setAreThumbnailsEnabled((prev) => !prev)}
                >
                  {areThumbnailsEnabled ? "Hide" : "Show"} thumbnails
                </button>
                <span
                  style={{
                    whiteSpace: "nowrap",
                    fontStyle: "italic",
                    marginRight: 4,
                  }}
                >
                  {slideIdx + 1} of {demoSlides.length}
                </span>
                <button
                  onClick={() => setSlideIdx((slideIdx) => slideIdx - 1)}
                  disabled={slideIdx <= 0}
                >
                  Prev
                </button>
                <button
                  onClick={() => setSlideIdx((slideIdx) => slideIdx + 1)}
                  disabled={slideIdx >= demoSlides.length - 1}
                >
                  Next
                </button>
              </Footer>
            </Layout>
          </Column>
        </Row>
      </Layout>
    );
  },
};

export default PresentationExpress;
