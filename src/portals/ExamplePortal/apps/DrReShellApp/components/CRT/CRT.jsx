import styles from "./CRT.module.css";
import classNames from "classnames";

// TODO: Borrow ideas from:
//  - https://codesandbox.io/s/crt-terminal-in-css-js-tlijm
//  - https://dev.to/ekeijl/retro-crt-terminal-screen-in-css-js-4afh

export default function CRT() {
  return (
    // the actual device
    <div className={styles["monitor"]}>
      {
        // the rounded edge near the glass
      }

      <div className={styles["bezel"]}>
        {
          // the overlay and horizontal pattern
        }
        <div
          className={classNames(styles["crt"], styles["off"])}
          // onClick="handleClick(event)"
        >
          {
            // slowly moving scanline
          }
          <div className={styles["scanline"]}></div>
          {
            // the input and output
          }
          <div className={styles["terminal"]}>This is a terminal</div>
        </div>
      </div>
    </div>
  );
}
