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
  ...rest
}) {
  return (
    <div {...rest} className={classNames(styles["content-button"], className)}>
      {children}
      <Cover>
        <ButtonTransparent
          onClick={onClick}
          style={{ width: "100%", height: "100%" }}
        />
      </Cover>
    </div>
  );
}
