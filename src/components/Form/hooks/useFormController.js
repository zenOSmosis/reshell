import { useCallback, useState } from "react";

import getFormValues from "@utils/getFormValues";

// TODO: Track dirty state

// TODO: Document
// NOTE: This is supposed to be a simpler alternative to: https://react-hook-form.com/
// Was struggling to make it easily work with onChange events in a clean way
export default function useFormController({
  onSubmit,
  onChange = () => null,
  validator = () => null,
}) {
  const [formElement, setFormRef] = useState(null);

  const [isValid, setIsValid] = useState(false);
  const [errors, setErrors] = useState({});

  // TODO: Document
  const validate = useCallback(
    formValues => {
      let hasErrors = false;

      const errors = Object.fromEntries(
        Object.entries(validator(formValues) || {}).filter(predicate => {
          const isError = Boolean(predicate[1]);

          if (isError) {
            hasErrors = true;
          }

          return isError;
        })
      );

      const isValid = !hasErrors;
      setIsValid(isValid);
      setErrors(errors);
      return isValid;
    },
    [validator]
  );

  // TODO: Document
  const handleFormChange = useCallback(
    evt => {
      const formValues = getFormValues(formElement);
      validate(formValues);

      onChange();
    },
    [validate, formElement, onChange]
  );

  // TODO: Document
  const handleFormSubmit = useCallback(
    evt => {
      evt.preventDefault();

      const formValues = getFormValues(formElement);
      const isValid = validate(formValues);

      if (isValid) {
        onSubmit(formValues);
      }
    },
    [validate, formElement, onSubmit]
  );

  return {
    isValid,
    validate,
    handleFormChange,
    handleFormSubmit,
    errors,
    setFormRef,
  };
}
