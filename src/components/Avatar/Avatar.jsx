import React, { useMemo } from "react";

import classNames from "classnames";
import styles from "./Avatar.module.css";

import PropTypes from "prop-types";

// TODO: Add remaining prop-types
Avatar.propTypes = {
  // NOTE (jh): This was added for consistency between image and font-based avatars
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

// TODO: Document
export default function Avatar({
  className,
  src,
  name,
  description,
  onEl,
  style = {},
  size = 80,
  ...rest
}) {
  const title = useMemo(
    () =>
      !name && !description
        ? ""
        : `${name}${description && ` | ${description}`}`,
    [name, description]
  );

  if (!src) {
    // TODO: Show default img src (i.e. a question mark) if no source is
    // available
    return null;
  }

  return (
    <img
      ref={onEl}
      className={classNames(styles["avatar"], className)}
      style={{ ...style, height: size, width: size }}
      src={src}
      alt={name}
      title={title}
      {...rest}
    />
  );
}
