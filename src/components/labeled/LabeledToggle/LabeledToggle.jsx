import React, { useMemo } from "react";
import Toggle from "@components/Toggle";
import PropTypes from "prop-types";
import classNames from "classnames";
import styles from "./LabeledToggle.module.css";

// TODO: Apply htmlFor ids for labels

LabeledToggle.propTypes = {
  labelOff: PropTypes.string,
  labelOn: PropTypes.string,

  masterLabel: PropTypes.string,
};

// TODO: Implement ability to disable
export default function LabeledToggle({
  className,
  labelOff = "Off",
  labelOn = "On",
  masterLabel = "",
  isOn,
  disabled,
  style,
  ...rest
}) {
  // Calculate padding for off / on labels in order to keep their positions
  // centered
  const [diffOff, diffOn] = useMemo(() => {
    const lenLabelOff = labelOff.length;
    const lenLabelOn = labelOn.length;
    const longestLength =
      lenLabelOff === lenLabelOn
        ? lenLabelOff
        : lenLabelOff > lenLabelOn
        ? lenLabelOff
        : lenLabelOn;
    const diffOff = longestLength - lenLabelOff;
    const diffOn = longestLength - lenLabelOn;

    return [diffOff, diffOn];
  }, [labelOff, labelOn]);

  return (
    <div
      className={classNames(
        styles["labeled-toggle"],
        disabled && styles["disabled"],
        className
      )}
      style={style}
    >
      <div className={styles["content-row"]}>
        <div
          className={classNames(
            styles["cell"],
            styles["label-wrap"],
            styles["left"],
            !isOn ? !disabled && styles["active"] : null
          )}
          // Add style 1/2 of an em per diff increment in order to balance
          // switch layout
          style={{ paddingLeft: `${diffOff / 2}em` }}
        >
          {labelOff}
        </div>
        <div className={styles["cell"]}>
          <Toggle isOn={isOn} disabled={disabled} style={style} {...rest} />
        </div>
        <div
          className={classNames(
            styles["cell"],
            styles["label-wrap"],
            styles["right"],
            isOn ? !disabled && styles["active"] : null
          )}
          // Add style 1/2 of an em per diff increment in order to balance
          // switch layout
          style={{ paddingRight: `${diffOn / 2}em` }}
        >
          {labelOn}
        </div>
      </div>
      <div className={styles["title-row"]}>{masterLabel}</div>
    </div>
  );
}
