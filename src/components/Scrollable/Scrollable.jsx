import Full from "../Full";

import styles from "./Scrollable.module.css";
import classNames from "classnames";

import PropTypes from 'prop-types'

Scrollable.propTypes = {
  // Whether or not to be scrollable by y axis. True by default.
  y: PropTypes.bool,

  // Whether or not to be scrollable by x axis
  x: PropTypes.bool,
}

export default function Scrollable({
  children,
  className,
  y = true,
  x = false,
  ...rest
}) {
  return (
    <Full
      {...rest}
      className={classNames({
        [styles["scrollable"]]: true,
        [styles["y"]]: y,
        [styles["x"]]: x,
        className,
      })}
    >
      {children}
    </Full>
  );
}
