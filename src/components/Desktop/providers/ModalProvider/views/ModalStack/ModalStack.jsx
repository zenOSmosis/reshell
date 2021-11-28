import React from "react";

import Modal from "../Modal";

// TODO: Document
// Handles multiple-rendered modals
export default function ModalStack({ modals = [], onModalClose }) {
  return (
    <>
      {modals.map(({ view, onClose, uuid }) => {
        return (
          <div key={uuid}>
            <Modal
              view={view}
              uuid={uuid}
              onClose={() => {
                if (typeof onClose === "function") {
                  onClose();
                }

                onModalClose(uuid);
              }}
            />
          </div>
        );
      })}
    </>
  );
}
