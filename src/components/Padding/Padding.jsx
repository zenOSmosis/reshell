import { useEffect, useState } from "react";

import styles from "./Padding.module.css";
import classNames from "classnames";

export default function Padding({ children, className, ...rest }) {
  const [el, setEl] = useState(null);
  const [hasSiblings, setHasSiblings] = useState(false);

  // Auto-determine if the element has siblings
  useEffect(() => {
    if (el) {
      const hasSiblings = Boolean(
        el.nextElementSibling || el.lastElementSibling
      );

      setHasSiblings(hasSiblings);
    }
  }, [el]);

  return (
    <div
      {...rest}
      ref={setEl}
      className={classNames(
        styles["padding"],
        !hasSiblings && styles["no-siblings"],
        className
      )}
    >
      {children}
    </div>
  );
}
