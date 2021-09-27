import styles from "../Window.module.css";

export default function WindowTitlebar({
  onElTitlebar,
  title,
  onRequestMinimize,
  onRequestClose,
}) {
  // onDoubleClick={handleToggleRestoreOrMaximize}

  return (
    <div ref={onElTitlebar} className={styles["titlebar"]}>
      <div className={styles["title"]}>{title}</div>
      <div className={styles["window-controls"]}>
        <button onClick={onRequestMinimize}>_</button>
        <button /* onClick={handleToggleRestoreOrMaximize} */>-</button>
        <button onClick={onRequestClose}>X</button>
      </div>
    </div>
  );
}
