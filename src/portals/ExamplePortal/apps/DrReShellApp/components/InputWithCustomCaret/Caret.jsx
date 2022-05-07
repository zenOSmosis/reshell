import { useEffect, useState } from "react";

import styles from "./InputWithCustomCaret.module.css";
import classNames from "classnames";

import { consume } from "phantom-core";

export default function Caret({ hPosition, className, content = "■" }) {
  const [isBlinking, setIsBlinking] = useState(true);

  useEffect(() => {
    if (!isBlinking) {
      const to = window.setTimeout(() => {
        setIsBlinking(true);
      }, 500);

      return () => window.clearTimeout(to);
    }
  }, [isBlinking]);

  useEffect(() => {
    consume(hPosition);

    setIsBlinking(false);
  }, [hPosition]);

  // TODO: Make this blink (w/ CSS)
  return (
    <div
      style={{
        left: hPosition / 2.5 + "em",
        top: 0,
      }}
      className={classNames(
        styles["caret"],
        isBlinking && styles["blinking"],
        className
      )}
    >
      {content}
    </div>
  );
}
