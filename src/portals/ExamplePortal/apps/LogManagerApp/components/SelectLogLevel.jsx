import { useCallback, useMemo } from "react";
import { LogLevel, enumToNumericIndexedObject } from "phantom-core";

import PropTypes from "prop-types";

SelectLogLevel.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func,
};

/**
 * Select component for log level values.
 */
export default function SelectLogLevel({ value, onChange, ...rest }) {
  const logLevels = useMemo(() => enumToNumericIndexedObject(LogLevel), []);

  // Coerce back to number
  const handleChange = useCallback(
    evt => {
      if (typeof onChange === "function") {
        onChange(parseInt(evt.target.value, 10));
      }
    },
    [onChange]
  );

  return (
    <select value={value?.toString()} onChange={handleChange} {...rest}>
      {Object.entries(logLevels).map(([optionValue, optionLabel]) => (
        <option key={optionValue} value={optionValue}>
          {optionLabel}
        </option>
      ))}
    </select>
  );
}
