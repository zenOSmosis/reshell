import React, { useEffect, useMemo, useState } from "react";
import classNames from "classnames";
import styles from "./AutoScaler.module.css";
import requestSkippableAnimationFrame from "request-skippable-animation-frame";
import { v4 as uuidv4 } from "uuid";

/**
 * Fix issue on iOS 13 where ResizeObserver isn't available.
 */
import { install } from "resize-observer";
if (!window.ResizeObserver) {
  install();
}

// FIXME: (jh) Fix issue where SVG images appear blurry if scaled on Safari
// (experienced issues on Safari 14 & 15; not tested on other versions at this
// time)
// Related issue: https://github.com/jzombie/pre-re-shell/issues/174

/**
 * Automatically applies CSS transform scaling to children to fill parent node,
 * while preserving aspect ratio.
 *
 * Useful for videos and canvases, where the resolution is a fixed size and
 * should not change.
 */
export default function AutoScaler({
  children,
  className,
  isEnlargeable = true,
  ...rest
}) {
  const [elOuterWrap, setElOuterWrap] = useState(null);
  const [elInnerWrap, setElInnerWrap] = useState(null);

  // TODO: Replace w/ useUUID
  const uuid = useMemo(uuidv4, []);

  // Handle scaling
  useEffect(() => {
    if (elOuterWrap && elInnerWrap) {
      let outerWrapSize = {
        width: 0,
        height: 0,
      };
      let innerWrapSize = {
        width: 0,
        height: 0,
      };

      // This is uesd w/ visibility below to try to reduce position defects
      // when first rendering
      elInnerWrap.style.visibility = "hidden";

      const ro = new ResizeObserver(entries => {
        requestSkippableAnimationFrame(() => {
          for (const entry of entries) {
            const size = {
              width: entry.target.offsetWidth,
              height: entry.target.offsetHeight,
            };

            if (entry.target === elOuterWrap) {
              outerWrapSize = size;
            } else {
              innerWrapSize = size;
            }
          }

          // Determine against all available space
          const maxScaleX = outerWrapSize.width / innerWrapSize.width;
          const maxScaleY = outerWrapSize.height / innerWrapSize.height;

          let scale = Math.min(maxScaleX, maxScaleY);

          if (!isEnlargeable && scale > 1) {
            scale = 1;
          }

          elInnerWrap.style.transform = `scale(${scale}, ${scale})`;

          if (elInnerWrap.style.visibility === "hidden") {
            setTimeout(() => {
              elInnerWrap.style.visibility = "visible";
            }, 4);
          }
        }, uuid);
      });

      ro.observe(elOuterWrap);
      ro.observe(elInnerWrap);

      return function unmount() {
        ro.unobserve(elOuterWrap);
        ro.unobserve(elInnerWrap);
      };
    }
  }, [elOuterWrap, elInnerWrap, uuid]);

  return (
    <div
      {...rest}
      ref={setElOuterWrap}
      className={classNames(styles["auto-scaler"], className)}
    >
      <div ref={setElInnerWrap} className={styles["content-wrap"]}>
        {children}
      </div>
    </div>
  );
}
