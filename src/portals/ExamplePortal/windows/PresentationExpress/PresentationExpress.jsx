import { useState } from "react";
import Layout, { Content, Footer, Row, Column } from "@components/Layout";
import Center from "@components/Center";

import demoSlides from "./demo.slides";

const PresentationExpress = {
  id: "presentation-express",
  title: "Presentation Express",
  style: {
    left: "auto",
    bottom: 0,
    width: 640,
    height: 480,
  },
  view: function View() {
    const [slideIdx, setSlideIdx] = useState(0);

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
            <div style={{ width: "100%", height: "100%", overflow: "auto" }}>
              {demoSlides.map((slide, idx) => {
                const { view: SlideView } = slide;

                const isSelected = idx === slideIdx;

                return (
                  <button
                    key={idx}
                    onClick={() => setSlideIdx(idx)}
                    style={{
                      width: "90%",
                      height: 80,
                      backgroundColor: "rgba(0,0,0,.4)",
                      display: "inline-block",
                      margin: "10px auto",
                      border: `1px ${isSelected ? "red" : "black"} solid`,
                    }}
                  >
                    <SlideView />
                  </button>
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
