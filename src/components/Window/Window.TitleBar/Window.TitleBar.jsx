import { useMemo } from "react";
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
  onElTitleBar,
  title,
  onRestoreOrMaximize,
  onMinimize,
  onClose,
  titleBarView: TitleBarView,
  ...rest
}) {
  const uiParadigm = useUIParadigm();

  const shouldDisplay = uiParadigm === DESKTOP_PARADIGM || TitleBarView;

  const dynamicProps = useMemo(() => {
    if (uiParadigm === DESKTOP_PARADIGM) {
      return {
        onDoubleClick: onRestoreOrMaximize,
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
      ref={onElTitleBar}
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
