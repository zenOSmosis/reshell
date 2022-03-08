import React from "react";
import classNames from "classnames";
import styles from "./Toggle.module.css";
import PropTypes from "prop-types";
import useUUID from "@hooks/useUUID";

Toggle.propTypes = {
  isOn: PropTypes.bool,

  // Invoked with boolean "on" value as its argument
  onChange: PropTypes.func,

  disabled: PropTypes.bool,
};

export default function Toggle({
  className,
  isOn,
  disabled,
  onChange = () => null,
  ...rest
}) {
  const domId = useUUID();

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
        // FIXME: (jh) Implement optional name and value: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#value
        checked={isOn}
        onChange={evt => onChange(evt.target.checked)}
        disabled={disabled}
      />
      <label htmlFor={domId} className={styles["toggle"]}></label>
    </div>
  );
}
