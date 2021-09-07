import React, { useEffect, useRef } from "react";
import classNames from "classnames";
import styles from "./Box3D.module.css";

// TODO: Finish building out
export default function Box3D({
  children,
  className,
  rotateX = 0,
  rotateY = 0,
  translateZ = 0,
  // TODO: Implement (helpers for rotate, etc.)
  // showSide = "FRONT",
  // TODO: onRotate (especially after using showSide)
}) {
  const refBoxScene = useRef(null);
  const refBox = useRef(null);

  useEffect(() => {
    const box = refBox.current;

    if (box) {
      window.requestAnimationFrame(() => {
        box.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${translateZ}px)`;
      });
    }
  }, [rotateX, rotateY, translateZ]);

  return (
    <div className={classNames(styles["Box3D"], className)}>
      <div ref={refBoxScene} className={styles["Box3DScene"]}>
        <div ref={refBox} className={styles["Box"]}>
          <div
            className={classNames(
              styles["Box__Face"],
              styles["Box__Face--FRONT"]
            )}
          >
            {children || "Front"}
          </div>

          <div
            className={classNames(
              styles["Box__Face"],
              styles["Box__Face--BACK"]
            )}
          >
            Back
          </div>
          <div
            className={classNames(
              styles["Box__Face"],
              styles["Box__Face--RIGHT"]
            )}
          >
            Right
          </div>
          <div
            className={classNames(
              styles["Box__Face"],
              styles["Box__Face--LEFT"]
            )}
          >
            Left
          </div>
          <div
            className={classNames(
              styles["Box__Face"],
              styles["Box__Face--TOP"]
            )}
          >
            Top
          </div>
          <div
            className={classNames(
              styles["Box__Face"],
              styles["Box__Face--BOTTOM"]
            )}
          >
            Bottom
          </div>
        </div>
      </div>
    </div>
  );
}
