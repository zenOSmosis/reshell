import React, { useCallback, useEffect, useState } from "react";
import NoWrap from "../NoWrap";

import PropTypes from "prop-types";

Timer.propTypes = {
  onTick: PropTypes.func.isRequired,
};

// TODO: Document
export default function Timer({ onTick, className, ...rest }) {
  const [seconds, _setSeconds] = useState(onTick());

  const getSeconds = useCallback(() => {
    const seconds = onTick();

    return seconds;
  }, [onTick]);

  useEffect(() => {
    const handleUpdate = () => _setSeconds(getSeconds());

    // Perform initial render
    handleUpdate();

    const updateInterval = setInterval(handleUpdate, 1000);

    return function unmount() {
      clearInterval(updateInterval);
    };
  }, [getSeconds]);

  return <NoWrap {...rest}>{getSecondsToHHMMSS(seconds)}</NoWrap>;
}

// TODO: Refactor
/**
 * @see https://stackoverflow.com/questions/1322732/convert-seconds-to-hh-mm-ss-with-javascript
 *
 * @param {number} seconds
 * @return {string} hh:mm:ss format
 */
function getSecondsToHHMMSS(secs) {
  // Note: This version should handle seconds if length is longer than one day
  return new Date((secs % (60 * 60 * 24)) * 1000).toISOString().substr(11, 8);
}
