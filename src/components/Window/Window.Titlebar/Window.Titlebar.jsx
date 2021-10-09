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
        <div className={styles["title"]}>{title}</div>
      )}

      <NoWrap className={styles["window-controls"]}>
        <WindowTitlebarMaximizeButton onClick={onRestoreOrMaximize} />
        <WindowTitlebarMinimizeButton onClick={onMinimize} />
        <WindowTitlebarCloseButton onClick={onClose} />
      </NoWrap>
    </div>
  );
}
