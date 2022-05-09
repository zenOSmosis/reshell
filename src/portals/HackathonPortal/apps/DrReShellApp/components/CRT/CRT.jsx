import Full from "@components/Full";

import styles from "./CRT.module.css";
import classNames from "classnames";

// TODO: Preload
import keySound from "./sounds/zNBy-key4.mp3";

import useWindowKeyboardEvents from "@hooks/useWindowKeyboardEvents";

// TODO: Borrow ideas from:
//  - https://codesandbox.io/s/crt-terminal-in-css-js-tlijm
//  - https://dev.to/ekeijl/retro-crt-terminal-screen-in-css-js-4afh

export default function CRT({ children }) {
  // TODO: Move
  // Handle keyboard typing effect
  useWindowKeyboardEvents({
    onKeyDown: () => {
      // Bind to an input
      //
      // TODO: Incorporate additional audio
      const s = new Audio(keySound);
      s.play();
    },
  });

  return (
    // the actual device
    <Full className={styles["monitor"]}>
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
          <div className={styles["terminal"]}>
            {children}
            {/*
            async function input(pw) {
            return new Promise(resolve => {
                const onKeyDown = event => {
                    if (event.keyCode === 13) {
                        event.preventDefault();
                        let result = event.target.textContent;
                        resolve(result);
                    }
                };

                let terminal = document.querySelector(".terminal");
                let input = document.createElement("div");
                input.setAttribute("id", "input");
                input.setAttribute("contenteditable", true);
                input.addEventListener("keydown", onKeyDown);
                terminal.appendChild(input);
                input.focus();
            });
        }
            */}
          </div>
        </div>
      </div>
    </Full>
  );
}
