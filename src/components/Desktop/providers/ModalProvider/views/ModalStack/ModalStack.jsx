import React from "react";

import Modal from "../Modal";

// TODO: Document
// Handles multiple-rendered modals
export default function ModalStack({ modals = [] }) {
  // TODO: Remove
  console.log({ modals });

  return (
    <>
      {modals.map(({ view, uuid, onClose, ...rest }) => {
        return (
          <div key={uuid}>
            <Modal {...rest} view={view} uuid={uuid} onClose={onClose} />
          </div>
        );
      })}
    </>
  );
}
