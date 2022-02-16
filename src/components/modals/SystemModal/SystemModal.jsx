import React, { useState } from "react";
import Full from "@components/Full";
import Layout, { Header, Content, Footer } from "@components/Layout";
import Padding from "@components/Padding";

import CloseIcon from "@icons/CloseIcon";

import classNames from "classnames";
import styles from "./SystemModal.module.css";

import useViewportSize from "@hooks/useViewportSize";
import useKeyboardEvents from "@hooks/useKeyboardEvents";

let _prevIsSmallViewport = false;

// TODO: Add prop-types
/**
 * TODO: Document updated type
 *
 * SystemModal is inspired by OS setup screens, and is typically used outside
 * of the main application to drive any sort of helper utilities needed to
 * configure the application.
 */
export default function SystemModal({
  children,
  className,
  onClose,
  headerView = null,
  footerView = ({ onClose }) => (
    <div style={{ textAlign: "center" }}>
      <Padding>
        <button onClick={onClose} style={{ backgroundColor: "red" }}>
          <CloseIcon /> Cancel
        </button>
      </Padding>
    </div>
  ),
  // theme = THEME_DARK,
}) {
  const [isSmallViewport, _setIsSmallViewport] = useState(_prevIsSmallViewport);

  // Cache value for next full SystemModal lifecycle
  //
  // Fixes issue where display readjusts when switching navigation links in
  // SystemModal
  _prevIsSmallViewport = isSmallViewport;

  // Automatically configure layout based on viewport size
  useViewportSize(({ width, height }) => {
    // TODO: Use range constants
    if (width < 500 || height < 600) {
      _setIsSmallViewport(true);
    } else {
      _setIsSmallViewport(false);
    }
  });

  // Close modal when escape button is pressed
  useKeyboardEvents(window, {
    onEscape: onClose,
  });

  return (
    <Full
      className={classNames(
        styles["system-modal"],
        isSmallViewport ? styles["small-viewport"] : null,
        className
      )}
    >
      <div className={styles["outer-wrap"]}>
        <div className={styles["inner-wrap"]}>
          <Layout>
            {headerView && (
              <Header className={styles["header"]}>
                {typeof headerView === "function"
                  ? headerView({ onClose })
                  : headerView}
              </Header>
            )}

            <Content>{children}</Content>

            {footerView && (
              <Footer className={styles["footer"]}>
                {typeof footerView === "function"
                  ? footerView({ onClose })
                  : footerView}
              </Footer>
            )}
          </Layout>
        </div>
      </div>
    </Full>
  );
}
