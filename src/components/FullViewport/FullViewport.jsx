import React, { useEffect, useState } from "react";
import classNames from "classnames";

import styles from "./FullViewport.module.css";

// import PropTypes from "prop-types";

export default function FullViewport({ className, children, ...rest }) {
  const [elContainer, setElContainer] = useState(null);

  useEffect(() => {
    if (elContainer) {
      // Dynamically add .full-viewport to html / body elements
      document.documentElement.classList.add(styles["html-full-viewport"]);
      document.body.classList.add(styles["body-full-viewport"]);

      const handleResize = () => {
        // NOTE: The setImmediate wrap seems to help fix layout issues on iOS
        // 14 after screen rotation
        setImmediate(() => {
          elContainer.style.height = window.innerHeight + "px";

          // Fixes issue on iOS where the content may be behind the URL bar after typing
          document.body.scrollTop = 0;
        });
      };

      // Perform initial size handling
      handleResize();

      // Bind resize handler
      window.addEventListener("resize", handleResize);

      // Poll the resize handler every second to help fix layout issues with iOS
      const resizeInterval = setInterval(handleResize, 1000);

      return () => {
        // Dynamically remove .full-viewport from html / body elements
        document.documentElement.classList.remove(styles["html-full-viewport"]);
        document.body.classList.remove(styles["body-full-viewport"]);

        // Unbind resize handler
        window.removeEventListener("resize", handleResize);

        // Stop poll interval
        clearInterval(resizeInterval);
      };
    }
  }, [elContainer]);

  return (
    <div
      {...rest}
      ref={setElContainer}
      className={classNames(styles["full-viewport"], className)}
    >
      {children}
    </div>
  );
}
