import { useCallback, useState } from "react";
import Full from "../Full";
import Cover from "../Cover";
import Center from "../Center";
import LoadingSpinner from "../LoadingSpinner";

import styles from "./IFrame.module.css";
import classNames from "classnames";

import PropTypes from "prop-types";

IFrame.propTypes = {
  src: PropTypes.string.isRequired,
  title: PropTypes.string,
};

// TODO: Document
export default function IFrame({
  src,
  title = null,
  className = null,
  ...rest
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoad = useCallback(() => setIsLoaded(true), []);

  // TODO: While loading, show overlay

  return (
    <Full>
      <iframe
        {...rest}
        src={src}
        className={classNames(styles["iframe"], className)}
        title={title || src}
        onLoad={handleLoad}
      ></iframe>
      {!isLoaded && (
        <>
          <Cover>
            <Center>
              <LoadingSpinner />
            </Center>
          </Cover>
        </>
      )}
    </Full>
  );
}
