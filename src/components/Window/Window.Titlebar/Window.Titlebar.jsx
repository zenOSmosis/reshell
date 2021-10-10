import NoWrap from "@components/NoWrap";

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
}) {
  // onDoubleClick={handleToggleRestoreOrMaximize})

  return (
    <div
      ref={onElTitlebar}
      className={styles["titlebar"]}
      onDoubleClick={onRestoreOrMaximize}
    >
      {TitleBarView ? (
        TitleBarView
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
