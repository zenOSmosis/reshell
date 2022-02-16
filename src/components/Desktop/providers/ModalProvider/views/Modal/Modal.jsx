import React from "react";

import Cover from "@components/Cover";

// TODO: Add PropTypes
// TODO: Document
export default function Modal({ view: View, onClose, ...rest }) {
  return (
    <Cover>
      <View {...rest} onClose={onClose} />
    </Cover>
  );
}
