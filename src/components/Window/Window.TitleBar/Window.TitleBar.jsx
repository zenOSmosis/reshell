import NoWrap from "@components/NoWrap";
import Full from "@components/Full";

import styles from "../Window.module.css";

import {
  WindowTitleBarMaximizeButton,
  WindowTitleBarMinimizeButton,
  WindowTitleBarCloseButton,
} from "./Window.TitleBar.Button";

export default function WindowTitleBar({
  onElTitleBar,
  title,
  onRestoreOrMaximize,
  onMinimize,
  onClose,
  titleBarView: TitleBarView,
  ...rest
}) {
  return (
    <div
      {...rest}
      ref={onElTitleBar}
      className={styles["title-bar"]}
      onDoubleClick={onRestoreOrMaximize}
    >
      {TitleBarView ? (
        <Full>{TitleBarView}</Full>
      ) : (
        <>
          <NoWrap
            style={{
              // Offset width of window-controls in order to make the title centered
              width: 80,
            }}
          />
          <NoWrap className={styles["title"]}>{title}</NoWrap>
        </>
      )}

      <NoWrap className={styles["window-controls"]}>
        <WindowTitleBarMaximizeButton onClick={onRestoreOrMaximize} />
        <WindowTitleBarMinimizeButton onClick={onMinimize} />
        <WindowTitleBarCloseButton onClick={onClose} />
      </NoWrap>
    </div>
  );
}
