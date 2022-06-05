import styles from "./Speaker.module.css";

export default function SpeakerWoofer() {
  return (
    <div className={styles["woofer"]}>
      <div className={styles["cone woofer__cone"]}>
        <div className={styles["woofer__cone-outer"]}></div>
        <div className={styles["woofer__cone-mid"]}></div>
        <div className={styles["woofer__cone-inner"]}></div>
      </div>
      {/*
              <div className={styles["dust-cap woofer__dust-cap"]}></div>
      <div className={styles["frame woofer__frame"]}></div>
      <ul className={styles["screws"]}>
        <li className={styles["screw woofer__screw"]}></li>
        <li className={styles["screw woofer__screw"]}></li>
        <li className={styles["screw woofer__screw"]}></li>
        <li className={styles["screw woofer__screw"]}></li>
        <li className={styles["screw woofer__screw"]}></li>
        <li className={styles["screw woofer__screw"]}></li>
        <li className={styles["screw woofer__screw"]}></li>
        <li className={styles["screw woofer__screw"]}></li>
      </ul>
        */}
    </div>
  );
}
