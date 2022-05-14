import Full from "@components/Full";

import styles from "./CRT.module.css";
import classNames from "classnames";

// TODO: Document
/**
 * Ideas borrowed from:
 *  - https://codesandbox.io/s/crt-terminal-in-css-js-tlijm
 *  - https://dev.to/ekeijl/retro-crt-terminal-screen-in-css-js-4afh
 */
export default function CRT({ children }) {
  return (
    // the actual device
    <Full className={classNames(styles["crt"], styles["off"])}>
      {
        // slowly moving scanline
      }
      <div className={styles["scanline"]}></div>
      {
        // the input and output
      }
      <div className={styles["terminal"]}>{children}</div>
    </Full>
  );
}
