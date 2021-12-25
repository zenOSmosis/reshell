import React from "react";
import AutoScaler from "../AutoScaler";
import Cover from "../Cover";
import Full from "../Full";
import Image from "../Image";
import classNames from "classnames";
import styles from "./Background.module.css";

// TODO: Document and add prop-types
export default function Background({
  children,
  src,
  className,
  style,
  onLoad = ref => null,
  ...propsRest
}) {
  return (
    <Full
      {...propsRest}
      className={classNames(styles["background"], className)}
    >
      <Cover className={styles["cover"]}>
        {
          // TODO: Refactor the following conditional logic into a separate
          // utility
        }
        {typeof src === "string" && (
          <Image className={styles["image"]} src={src} onLoad={onLoad} />
        )}
        {(typeof src === "object" || typeof src === "function") &&
          (() => {
            const DisplayComponent = src;

            return (
              <AutoScaler>
                <DisplayComponent />
              </AutoScaler>
            );
          })()}
      </Cover>

      <Cover style={style}>{children}</Cover>
    </Full>
  );
}
