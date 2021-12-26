import React from "react";
import AutoScaler from "../AutoScaler";
import StaggeredWaveLoading from "../StaggeredWaveLoading";
import PropTypes from "prop-types";

import usePreload from "@hooks/usePreload";

Preload.propTypes = {
  /**
   * @type {string[]} A list of URLs to preload.
   */
  preloadResources: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,

  onError: PropTypes.func,
};

export default function Preload({
  children,
  preloadResources,
  onError = err => console.warn("Caught", err),
  ...rest
}) {
  const { isPreloaded /* progress */ } = usePreload(preloadResources);

  if (!isPreloaded) {
    return (
      <AutoScaler {...rest}>
        <StaggeredWaveLoading />
      </AutoScaler>
    );
  } else {
    return <React.Fragment>{children}</React.Fragment>;
  }
}
