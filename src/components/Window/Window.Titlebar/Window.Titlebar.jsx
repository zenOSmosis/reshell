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
}) {
  // onDoubleClick={handleToggleRestoreOrMaximize}

  return (
    <div ref={onElTitlebar} className={styles["titlebar"]}>
      <div className={styles["title"]}>{title}</div>
      <div className={styles["window-controls"]}>
        <WindowTitlebarMaximizeButton onClick={onRestoreOrMaximize} />
        <WindowTitlebarMinimizeButton onClick={onMinimize} />
        <WindowTitlebarCloseButton onClick={onClose} />
      </div>
    </div>
  );
}
