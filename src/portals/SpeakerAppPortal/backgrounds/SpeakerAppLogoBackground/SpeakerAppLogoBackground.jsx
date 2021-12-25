import React from "react";
import Background from "@components/Background";
import Preload from "@components/Preload";

import speakerAppLogo from "../../assets/speaker.app.logo.svg";

// import classNames from "classnames";
// import styles from "./SpeakerAppLogoBackground.module.css";

// TODO: Gradient logo
// @see https://developer.mozilla.org/en-US/docs/Web/CSS/background-clip
//
/**
 * background-clip: text;
 * -webkit-background-clip: text;
 * color: transparent;
 *     background: -webkit-linear-gradient(
-70deg
,#db469f,#2188ff);
 */

export default function SpeakerAppLogoBackground({ children, ...rest }) {
  return (
    <Preload preloadResources={[speakerAppLogo]}>
      <Background
        {...rest}
        src={() => (
          <div style={{ padding: 20 }}>
            <img src={speakerAppLogo} alt="Speaker.app" />
            <div style={{ opacity: ".8", fontWeight: "bold" }}>
              <span style={{ color: "orange" }}>speaker</span>.app
            </div>
          </div>
        )}
      >
        {children}
      </Background>
    </Preload>
  );
}
