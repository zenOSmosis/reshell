import NoWrap from "@components/NoWrap";
import Full from "@components/Full";

import styles from "../Window.module.css";

import {
  WindowTitlebarMaximizeButton,
  WindowTitlebarMinimizeButton,
  WindowTitlebarCloseButton,
} from "./Window.Titlebar.Button";

export default function WindowTitlebar({
  onElTitlebar,
  title,
  onRestoreOrMaximize,
  onMinimize,
  onClose,
  titleBarView: TitleBarView,
  ...rest
}) {
  // onDoubleClick={handleToggleRestoreOrMaximize})

  return (
    <div
      {...rest}
      ref={onElTitlebar}
      className={styles["titlebar"]}
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
        <WindowTitlebarMaximizeButton onClick={onRestoreOrMaximize} />
        <WindowTitlebarMinimizeButton onClick={onMinimize} />
        <WindowTitlebarCloseButton onClick={onClose} />
      </NoWrap>
    </div>
  );
}
