import Full from "../Full";

import ReactJson from "react-json-view";

import PropTypes from "prop-types";

ObjectViewer.propTypes = {
  src: PropTypes.object.isRequired,
};

export default function ObjectViewer({ src }) {
  return (
    <Full style={{ overflowY: "auto" }}>
      <ReactJson
        src={src}
        theme="monokai"
        style={{ width: "100%", height: "100%" }}
      />
    </Full>
  );
}
