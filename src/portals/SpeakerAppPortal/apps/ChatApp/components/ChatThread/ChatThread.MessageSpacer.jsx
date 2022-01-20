import styles from "./ChatThread.module.css";

/**
 * Adds spacing around chat thread messages.
 */
export default function ChatThreadMessageSpacer() {
  return <div className={styles["message-spacer"]} />;
}
