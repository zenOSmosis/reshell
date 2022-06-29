import Center from "@components/Center";
import Padding from "@components/Padding";

import SystemModal from "../SystemModal";

import PropTypes from "prop-types";

ConfirmModal.propTypes = {
  text: PropTypes.string.isRequired,
};

/**
 * Renders a boolean "accept" / "reject" (yes / no) dialog.
 */
export default function ConfirmModal({
  text,
  onCancel,
  onClose,
  footerView = ({ onCancel, onClose }) => (
    <div style={{ textAlign: "center" }}>
      <Padding>
        <button
          onClick={onClose}
          style={{
            backgroundColor: "#CD1F2A",
          }}
        >
          Confirm
        </button>

        <div style={{ display: "inline-block", width: "1em" }} />

        <button
          onClick={onCancel}
          style={{
            // TODO: Use color variable for highlighted elements
            backgroundColor: "#347fe8",
          }}
        >
          Cancel
        </button>
      </Padding>
    </div>
  ),
  ...rest
}) {
  return (
    <SystemModal
      {...rest}
      onCancel={onCancel}
      onClose={onClose}
      footerView={footerView}
    >
      <Center canOverflow={true} style={{ fontWeight: "bold" }}>
        {text}
      </Center>
    </SystemModal>
  );
}
