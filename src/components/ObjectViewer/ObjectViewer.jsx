import Full from "../Full";
import ReactJson from "react-json-view";
import classNames from "classnames";

import styles from "./ObjectViewer.module.css";
import PropTypes from "prop-types";

ObjectViewer.propTypes = {
  src: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
};

export default function ObjectViewer({ className, src, ...rest }) {
  return (
    <Full {...rest} className={classNames(styles["object-viewer"], className)}>
      <ReactJson
        src={src}
        theme="monokai"
        // NOTE: className appears to be unsupported here
        style={{ width: "100%", height: "100%" }}
      />
    </Full>
  );
}
