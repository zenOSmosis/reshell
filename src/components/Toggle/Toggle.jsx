import React, { useMemo } from "react";
import classNames from "classnames";
import styles from "./Toggle.module.css";
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";

Toggle.propTypes = {
  onChange: PropTypes.func,

  isOn: PropTypes.bool,

  disabled: PropTypes.bool,
};

export default function Toggle({
  className,
  onChange = () => null,
  isOn,
  disabled,
  ...rest
}) {
  const domId = useMemo(uuidv4, []);

  return (
    <div
      className={classNames(
        styles["toggle-wrapper"],
        disabled && styles["disabled"],
        className
      )}
      {...rest}
    >
      <input
        type="checkbox"
        id={domId}
        className={styles["checkbox"]}
        checked={isOn}
        onChange={evt => onChange(evt.target.checked)}
        disabled={disabled}
      />
      <label htmlFor={domId} className={styles["toggle"]}></label>
    </div>
  );
}
