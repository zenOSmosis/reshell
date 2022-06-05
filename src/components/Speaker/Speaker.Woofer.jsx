import AutoScaler from "../AutoScaler";

import styles from "./Speaker.module.css";
import classNames from "classnames";

// TODO: Map this for reference
/*
// bin 3 : ~86 Hz - kick drum
let percVol = this.dataArray[2] / 255;
TweenLite.to(this.wooferConeOuter, 0.001, {css:{scale: (1 + (percVol * 0.05)) }});


// bin 8 : ~301 Hz - low snare
percVol = this.dataArray[7] / 255;
TweenLite.to(this.wooferConeMid, 0.001, {css:{scale: (1 + (percVol * 0.1)) }});


// bin 17 : ~689 Hz - high snare
percVol = this.dataArray[16] / 255;
TweenLite.to(this.wooferConeInner, 0.001, {css:{scale: (1 + (percVol * 0.1)) }});


// bin 221 : ~9,500 Hz - hi hats
percVol = this.dataArray[220] / 255;
TweenLite.to(this.tweeterConeInner, 0.001, {css:{scale: (1 + (percVol * 0.09)) }});
*/

export default function SpeakerWoofer({
  onMountOuterCone,
  onMountMidCone,
  onMountInnerCone,
  ...rest
}) {
  return (
    <AutoScaler {...rest}>
      <div className={styles["woofer"]}>
        <div className={classNames(styles["cone"], styles["woofer__cone"])}>
          <div
            ref={onMountOuterCone}
            className={styles["woofer__cone-outer"]}
          ></div>
          <div
            ref={onMountMidCone}
            className={styles["woofer__cone-mid"]}
          ></div>
          <div
            ref={onMountInnerCone}
            className={styles["woofer__cone-inner"]}
          ></div>
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
