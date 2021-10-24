import styles from "../../Window.module.css";

export function WindowTitlebarMaximizeButton({ ...rest }) {
  return <WindowTitlebarButton {...rest} className={styles["maximize"]} />;
}

export function WindowTitlebarMinimizeButton({ ...rest }) {
  return <WindowTitlebarButton {...rest} className={styles["minimize"]} />;
}

export function WindowTitlebarCloseButton({ ...rest }) {
  return <WindowTitlebarButton {...rest} className={styles["close"]} />;
}

function WindowTitlebarButton({ ...rest }) {
  // TODO: Compose with specific buttons for "green", "yellow", and "red".

  return <button {...rest}></button>;
}
