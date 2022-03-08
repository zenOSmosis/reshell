import { useMemo, useRef } from "react";
import NoWrap from "@components/NoWrap";
import Full from "@components/Full";

import styles from "../Window.module.css";

import useUIParadigm, { DESKTOP_PARADIGM } from "@hooks/useUIParadigm";

import {
  WindowTitleBarMaximizeButton,
  WindowTitleBarMinimizeButton,
  WindowTitleBarCloseButton,
} from "./Window.TitleBar.Button";

// TODO: Document
// TODO: Add prop-types
export default function WindowTitleBar({
  title,
  onRestoreOrMaximize,
  onMinimize,
  onClose,
  titleBarView: TitleBarView,
  ...rest
}) {
  const refElTitleBar = useRef(null);

  const { uiParadigm } = useUIParadigm();

  /** @type {boolean} Whether or not the title bar should display at all */
  const shouldDisplay = uiParadigm === DESKTOP_PARADIGM || TitleBarView;

  /**
   * These props are dynamically created for the title bar depending on the
   * current UI paradigm.
   *
   * @type {Object}
   */
  const dynamicProps = useMemo(() => {
    if (uiParadigm === DESKTOP_PARADIGM) {
      return {
        onDoubleClick: evt => {
          // This conditional is intended to prevent inadvertent maximizing or
          // restoring if a custom title bar is used with additional control
          // inputs
          if (evt.target.tagName === "DIV") {
            onRestoreOrMaximize(evt);
          }
        },
      };
    } else {
      return {};
    }
  }, [uiParadigm, onRestoreOrMaximize]);

  if (!shouldDisplay) {
    return null;
  }

  return (
    <div
      {...rest}
      ref={refElTitleBar}
      className={styles["title-bar"]}
      {...dynamicProps}
    >
      {TitleBarView ? (
        <Full>{TitleBarView}</Full>
      ) : (
        <NoWrap className={styles["title"]}>{title}</NoWrap>
      )}

      {uiParadigm === DESKTOP_PARADIGM && (
        <NoWrap className={styles["window-controls"]}>
          <WindowTitleBarMaximizeButton onClick={onRestoreOrMaximize} />
          <WindowTitleBarMinimizeButton onClick={onMinimize} />
          <WindowTitleBarCloseButton onClick={onClose} />
        </NoWrap>
      )}
    </div>
  );
}
