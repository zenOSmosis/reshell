import Cover from "../Cover";
import ButtonTransparent from "../ButtonTransparent";

import styles from "./ContentButton.module.css";
import classNames from "classnames";

import PropTypes from "prop-types";

ContentButton.propTypes = {
  className: PropTypes.string,

  onClick: PropTypes.func,
};

/**
 * An HTML content button which tries to not violate HTML specs.
 */
export default function ContentButton({
  children,
  className,
  onClick,
  disabled = false,
  ...rest
}) {
  return (
    <div {...rest} className={classNames(styles["content-button"], className)}>
      {children}
      <Cover>
        <ButtonTransparent
          className={styles["overlay"]}
          onClick={onClick}
          disabled={disabled}
        />
      </Cover>
    </div>
  );
}
