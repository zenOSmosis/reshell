import React from "react";
import AutoScaler from "../AutoScaler";
import StaggeredWaveLoading from "../StaggeredWaveLoading";
import PropTypes from "prop-types";

import usePreload from "@hooks/usePreload";

Preload.propTypes = {
  /** An array of URLs to preload */
  preloadResources: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,

  /** Called when there is a loading error  */
  onError: PropTypes.func,

  /** If true, disables loading indicator */
  disabledLoadingIndicator: PropTypes.bool,
};

export default function Preload({
  children,
  preloadResources,
  disabledLoadingIndicator = false,
  onError = err => console.warn("Caught", err),
  ...rest
}) {
  const { isPreloaded /* progress */ } = usePreload(preloadResources);

  if (!isPreloaded && !disabledLoadingIndicator) {
    return (
      <AutoScaler {...rest}>
        <StaggeredWaveLoading />
      </AutoScaler>
    );
  } else {
    return <React.Fragment>{children}</React.Fragment>;
  }
}
