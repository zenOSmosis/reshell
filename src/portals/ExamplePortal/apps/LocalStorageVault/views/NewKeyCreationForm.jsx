import { useCallback, useRef, useState } from "react";
import Center from "@components/Center";

import getFormValues from "@utils/getFormValues";

export default function NewKeyCreationForm({
  initialKey,
  initialValue,
  initialStorageEngine,
  storageEngines,
}) {
  const refForm = useRef(null);

  const [isValidated, setIsValidated] = useState(false);

  const handleFormValidation = useCallback(formValues => {
    const isValid = formValues.key.length > 0;

    setIsValidated(isValid);
  }, []);

  const handleFormChange = useCallback(
    evt => {
      const formElement = refForm.current;

      const formValues = getFormValues(formElement);
      handleFormValidation(formValues);
    },
    [handleFormValidation]
  );

  const handleFormSubmit = useCallback(
    evt => {
      evt.preventDefault();

      const formElement = refForm.current;

      const formValues = getFormValues(formElement);
      handleFormValidation(formValues);
    },
    [handleFormValidation]
  );

  return (
    <Center canOverflow={true}>
      <form
        ref={refForm}
        autoComplete="off"
        onSubmit={handleFormSubmit}
        onChange={handleFormChange}
      >
        <input
          name="key"
          type="text"
          placeholder="Key"
          defaultValue={initialKey}
        />

        <textarea
          name="value"
          placeholder="value"
          defaultValue={initialValue}
        ></textarea>

        <div style={{ marginTop: 20 }}>
          <label>Storage Engine</label>
          <select defaultValue={initialStorageEngine?.getTitle()}>
            {storageEngines.map(storageEngine => {
              const title = storageEngine.getTitle();

              return (
                <option key={title} value={title}>
                  {title}
                </option>
              );
            })}
          </select>
        </div>

        <div style={{ marginTop: 10 }}>
          <input type="submit" value="Submit" disabled={!isValidated} />
        </div>
      </form>
    </Center>
  );
}
