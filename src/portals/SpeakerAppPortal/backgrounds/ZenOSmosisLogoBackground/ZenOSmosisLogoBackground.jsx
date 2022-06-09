import React from "react";
import Background from "@components/Background";
import Preload from "@components/Preload";
import classNames from "classnames";

import zenOSmosisLogo from "../../../../assets/zenOSmosis-Logo-2046x530@72.png";

import styles from "./ZenOSmosisLogoBackground.module.css";

export default function ZenOSmosisLogoBackground({
  children,
  className,
  ...rest
}) {
  return (
    <Preload preloadResources={[zenOSmosisLogo]} disabledLoadingIndicator>
      <Background
        {...rest}
        className={styles["background"]}
        src={() => (
          <div className={classNames(styles["logo"], className)}>
            {
              // TODO: Experiment with changing background colors of speakers
              // within the logo itself (make it dynamic)
            }
            <img src={zenOSmosisLogo} alt="zenOSmosis" />
          </div>
        )}
      >
        {children}
      </Background>
    </Preload>
  );
}
