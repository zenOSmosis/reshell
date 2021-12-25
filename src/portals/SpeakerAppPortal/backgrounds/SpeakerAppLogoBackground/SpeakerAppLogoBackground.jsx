import React from "react";
import Background from "@components/Background";
import Preload from "@components/Preload";
import classNames from "classnames";

import speakerAppLogo from "../../assets/speaker.app.logo.svg";

import styles from "./SpeakerAppLogoBackground.module.css";

export default function SpeakerAppLogoBackground({
  children,
  className,
  ...rest
}) {
  return (
    <Preload preloadResources={[speakerAppLogo]}>
      <Background
        {...rest}
        src={() => (
          <div className={classNames(styles["logo"], className)}>
            <img src={speakerAppLogo} alt="Speaker.app" />
            <div className={styles["text"]}>
              <span className={styles["speaker"]}>speaker</span>
              <span className={styles["app"]}>.app</span>
            </div>
          </div>
        )}
      >
        {children}
      </Background>
    </Preload>
  );
}
