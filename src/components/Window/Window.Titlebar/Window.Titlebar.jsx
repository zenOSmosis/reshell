import styles from "../Window.module.css";

import WindowTitlebarButton from "./Window.Titlebar.Button";

export default function WindowTitlebar({
  onElTitlebar,
  title,
  onRestoreOrMaximize,
  onRestoreOrMinimize,
  onClose,
}) {
  // onDoubleClick={handleToggleRestoreOrMaximize}

  return (
    <div ref={onElTitlebar} className={styles["titlebar"]}>
      <div className={styles["title"]}>{title}</div>
      <div className={styles["window-controls"]}>
        <WindowTitlebarButton onClick={onRestoreOrMaximize} />
        <WindowTitlebarButton onClick={onRestoreOrMinimize} />
        <WindowTitlebarButton onClick={onClose} />
      </div>
    </div>
  );
}
