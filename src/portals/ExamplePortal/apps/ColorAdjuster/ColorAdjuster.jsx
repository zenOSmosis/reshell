import { useState, useEffect } from "react";
import Layout, { Content, Footer } from "@components/Layout";
import Center from "@components/Center";

import styles from "./ColorAdjuster.module.css";

const ColorAdjuster = {
  id: "color-adjuster",
  title: "Color Adjuster",
  style: {
    right: 0,
    top: 0,
    width: 640,
    height: 400,
  },
  // serviceClasses: [],
  view: function View({ windowController, windowServices }) {
    // TODO: Add service state; fix issue where if choosing grayscale, closing, then re-opening disables grayscale
    const [isGrayscale, setIsGrayscale] = useState(false);

    useEffect(() => {
      if (isGrayscale) {
        document.body.classList.add("grayscale");
      } else {
        document.body.classList.remove("grayscale");
      }
    }, [isGrayscale]);

    return (
      <Layout className={styles["color-adjuster"]}>
        <Content>
          <Center>
            <button onClick={() => setIsGrayscale((prev) => !prev)}>
              {isGrayscale ? "Disable" : "Enable"} Grayscale
            </button>
          </Center>
        </Content>
        <Footer>
          {
            // @see https://color.adobe.com/create/color-wheel

            ["#B04628", "#B9FC6D", "#FC7853", "#3A65FC", "#314EB0"].map(
              (color, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: color,
                    height: 100,
                    width: "20%",
                    display: "inline-block",
                  }}
                >
                  <Center>
                    <span
                      style={{
                        padding: 4,
                        backgroundColor: "rgba(0,0,0,.4)",
                        borderRadius: 4,
                      }}
                    >
                      {color}
                    </span>
                  </Center>
                </div>
              )
            )
          }
        </Footer>
      </Layout>
    );
  },
};

export default ColorAdjuster;
