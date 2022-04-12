import { consume } from "phantom-core";
import { useEffect, useRef, useState } from "react";

import classNames from "classnames";
import styles from "./AutoExpandingTextArea.module.css";

/**
 * A textarea which automatically sizes according to its content.
 */
export default function AutoExpandingTextArea({
  className,
  value,
  children,
  ...rest
}) {
  // Don't use children
  consume(children);

  const refEl = useRef(null);

  const [initialScrollHeight, setInitialScrollHeight] = useState(-1);

  useEffect(() => {
    const el = refEl.current;

    if (el) {
      if (initialScrollHeight === -1) {
        setInitialScrollHeight(el.scrollHeight);
      } else if (!value) {
        el.style.height = initialScrollHeight + "px";
      } else {
        let isUnmounting = false;
        let prevScrollHeight = 0;

        const autoSize = () => {
          if (!isUnmounting) {
            const scrollHeight = el.scrollHeight;

            const nextScrollHeight =
              scrollHeight > initialScrollHeight
                ? scrollHeight
                : initialScrollHeight;

            if (nextScrollHeight === prevScrollHeight) {
              return;
            }

            el.style.height = nextScrollHeight + "px";

            prevScrollHeight = nextScrollHeight;

            window.requestAnimationFrame(autoSize);
          }
        };

        autoSize();

        return () => {
          isUnmounting = true;
        };
      }
    }
  }, [value, initialScrollHeight]);

  const renderableValue = initialScrollHeight !== -1 ? value : "";

  return (
    <textarea
      ref={refEl}
      {...rest}
      className={classNames(styles["auto-expanding"], className)}
      value={renderableValue}
    />
  );
}
