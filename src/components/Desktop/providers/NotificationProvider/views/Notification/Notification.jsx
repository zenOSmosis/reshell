import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Animation from "@components/Animation";
import ContentButton from "@components/ContentButton";
import Padding from "@components/Padding";

import InfoIcon from "@icons/InfoIcon";
import CloseIcon from "@icons/CloseIcon";

import styles from "./Notification.module.css";

// TODO: Add PropTypes
/**
 * Desktop Notification view.
 */
export default function Notification({
  body,
  image,
  title,
  uuid,
  onClose,
  onClick,
  // In milliseconds
  autoCloseTime = 4000,
  ...rest
}) {
  // TODO: Should this state be managed from the outside?
  const [isClosing, setIsClosing] = useState(false);

  // IMPORTANT: refOnClose is memoized to fix an issue where generating new
  // notifications would restart the internal timer
  const refOnClose = useRef(onClose);
  const handleClose = useCallback(
    evt => {
      if (evt) {
        evt.stopPropagation();
      }

      setIsClosing(true);

      // NOTE (jh): We could also listen for Animation ended event, but decided
      // to do the easy route at first.
      setTimeout(
        () => {
          refOnClose.current(uuid);
        },
        // TODO: Make this value dynamic?
        500
      );
    },
    [uuid]
  );

  const [el, setEl] = useState(null);

  // Auto-close handling
  useEffect(() => {
    if (el) {
      let autoCloseTimeout = null;

      const startTimeout = () => {
        autoCloseTimeout = setTimeout(handleClose, autoCloseTime);
      };

      startTimeout();

      const stopTimeout = () => {
        clearTimeout(autoCloseTimeout);
      };

      el.addEventListener("mouseover", stopTimeout, { passive: true });
      el.addEventListener("mouseout", startTimeout, { passive: true });
      el.addEventListener("touchstart", stopTimeout, { passive: true });

      return function unmount() {
        el.removeEventListener("mouseover", stopTimeout, { passive: true });
        el.removeEventListener("mouseout", startTimeout, { passive: true });
        el.removeEventListener("touchstart", stopTimeout, { passive: true });

        stopTimeout();
      };
    }
  }, [el, autoCloseTime, handleClose]);

  // FIXME: Refactor into common Image component?
  const Image = useMemo(
    () => () => {
      switch (typeof image) {
        case "string":
          return (
            <img alt={title} src={image} className={styles["main-image"]} />
          );

        case "function":
          return image();

        default:
          return image || <InfoIcon />;
      }
    },
    [image, title]
  );

  return (
    <div
      ref={setEl}
      onTouchEnd={handleClose}
      onMouseUp={handleClose}
      className={styles["notification"]}
      {...rest}
    >
      <Animation
        animationName={!isClosing ? "slideInRight" : "slideOutRight"}
        animationDuration=".5s"
      >
        <ContentButton
          onClick={onClick}
          disabled={!onClick}
          className={styles["body-outer-wrap"]}
        >
          <div>
            <Padding>
              <div className={styles["main-image-wrap"]}>
                <Image />
              </div>
              <div className={styles["title"]}>{title}</div>

              <div className={styles["body"]}>{body}</div>
            </Padding>
          </div>
          <ContentButton onClick={handleClose} className={styles["close"]}>
            <Padding>
              <CloseIcon />
            </Padding>
          </ContentButton>
        </ContentButton>
      </Animation>
    </div>
  );
}
