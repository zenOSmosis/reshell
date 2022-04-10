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
 * A button with an HTML backdrop layer, which tries to not violate HTML specs.
 *
 * Why: Buttons can't contain many internal HTML elements (FIXME: Cite source),
 * so this works around that placing the button as a transparent overlay on top
 * of the content, instead of embedding the content in a button.
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
