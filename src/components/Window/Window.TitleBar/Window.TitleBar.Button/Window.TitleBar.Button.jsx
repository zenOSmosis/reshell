import styles from "../../Window.module.css";

export function WindowTitleBarMaximizeButton({ ...rest }) {
  return <WindowTitleBarButton {...rest} className={styles["maximize"]} />;
}

export function WindowTitleBarMinimizeButton({ ...rest }) {
  return <WindowTitleBarButton {...rest} className={styles["minimize"]} />;
}

export function WindowTitleBarCloseButton({ ...rest }) {
  return <WindowTitleBarButton {...rest} className={styles["close"]} />;
}

function WindowTitleBarButton({ ...rest }) {
  // TODO: Compose with specific buttons for "green", "yellow", and "red".

  return <button {...rest}></button>;
}
