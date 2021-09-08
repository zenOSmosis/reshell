import { useState, useEffect } from "react";
import Center from "@components/Center";

import "./ColorAdjuster.module.css";

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
    const [isGrayscale, setIsGrayscale] = useState(false);

    useEffect(() => {
      if (isGrayscale) {
        document.body.classList.add("grayscale");
      } else {
        document.body.classList.remove("grayscale");
      }
    }, [isGrayscale]);

    return (
      <Center>
        <button onClick={() => setIsGrayscale((prev) => !prev)}>
          {isGrayscale ? "Disable" : "Enable"} Grayscale
        </button>
      </Center>
    );
  },
};

export default ColorAdjuster;
