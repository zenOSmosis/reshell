import AutoScaler from "../AutoScaler";

import styles from "./Speaker.module.css";
import classNames from "classnames";

export default function SpeakerWoofer({ ...rest }) {
  return (
    <AutoScaler {...rest}>
      <div className={styles["woofer"]}>
        <div className={classNames(styles["cone"], styles["woofer__cone"])}>
          <div className={styles["woofer__cone-outer"]}></div>
          <div className={styles["woofer__cone-mid"]}></div>
          <div className={styles["woofer__cone-inner"]}></div>
        </div>
        <div
          className={classNames(styles["dust-cap"], styles["woofer__dust-cap"])}
        ></div>
        <div
          className={classNames(styles["frame"], styles["woofer__frame"])}
        ></div>
        <ul className={styles["screws"]}>
          <li
            className={classNames(styles["screw"], styles["woofer__screw"])}
          ></li>
          <li
            className={classNames(styles["screw"], styles["woofer__screw"])}
          ></li>
          <li
            className={classNames(styles["screw"], styles["woofer__screw"])}
          ></li>
          <li
            className={classNames(styles["screw"], styles["woofer__screw"])}
          ></li>
          <li
            className={classNames(styles["screw"], styles["woofer__screw"])}
          ></li>
          <li
            className={classNames(styles["screw"], styles["woofer__screw"])}
          ></li>
          <li
            className={classNames(styles["screw"], styles["woofer__screw"])}
          ></li>
          <li
            className={classNames(styles["screw"], styles["woofer__screw"])}
          ></li>
        </ul>
      </div>
    </AutoScaler>
  );
}
