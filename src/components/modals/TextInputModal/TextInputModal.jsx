import { useCallback, useState } from "react";
import Center from "@components/Center";
import Padding from "@components/Padding";
import { Row, Column } from "@components/Layout";

import SystemModal from "../SystemModal";

import useKeyboardEvents from "@hooks/useKeyboardEvents";
import useUUID from "@hooks/useUUID";

// TODO: Document
// TODO: Add prop-types
// TODO: Implement optional default value
export default function TextInputModal({
  className,
  label,
  placeholder,
  onClose,
  onCancel,
  onChange = () => null,
  ...rest
}) {
  const [elInput, setElInput] = useState(null);
  const [value, setValue] = useState("");

  // TODO: Document
  const handleChange = useCallback(
    evt => {
      const value = evt.target.value;
      setValue(value);
      onChange(value);
    },
    [onChange]
  );

  // TODO: Document
  const handleClose = useCallback(() => {
    onClose(value);
  }, [onClose, value]);

  const handleSubmit = handleClose;

  // FIXME: (jh) Use form controller instead?
  useKeyboardEvents(elInput, {
    onEnter: handleClose,
    // NOTE: Escape event is already handled by SystemModal
  });

  const elInputId = useUUID();

  return (
    <SystemModal
      {...rest}
      className={className}
      label={label}
      onCancel={onCancel}
      onClose={handleClose}
    >
      <Padding>
        <Center>
          <div style={{ textAlign: "left" }}>
            {label && <label htmlFor={elInputId}>{label}</label>}

            <Row>
              <Column>
                <input
                  ref={setElInput}
                  id={elInputId}
                  type="text"
                  onChange={handleChange}
                  placeholder={placeholder}
                  style={{
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                  }}
                />
              </Column>
              <Column style={{ maxWidth: 100 }}>
                <button
                  style={{
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,

                    // TODO: Use color variable for highlighted element
                    backgroundColor: "#347fe8",
                  }}
                  disabled={!Boolean(value)}
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              </Column>
            </Row>
          </div>
        </Center>
      </Padding>
    </SystemModal>
  );
}
