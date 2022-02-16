import { useCallback, useEffect, useState } from "react";

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

  // Perform initial checks to help ensure field values can be obtained and
  // that the form will not submit when the user doesn't expect it to
  useEffect(() => {
    if (formElement) {
      // Ensure form values can be detected
      if (!Object.values(getFormValues(formElement)).length) {
        console.warn(
          "No form values detected for form element.  All input fields should have a name or id attribute.",
          formElement
        );
      }

      // Ensure button elements have a type attribute
      for (const el of formElement.elements) {
        if (el.tagName.toUpperCase() === "BUTTON" && !el.getAttribute("type")) {
          console.warn(
            `All button elements should have a type attribute specified or they will default to "submit"`,
            el
          );
          break;
        }
      }
    }
  }, [formElement]);

  const [isValid, setIsValid] = useState(false);
  const [errors, setErrors] = useState({});

  // TODO: Document
  const handleFormValidate = useCallback(
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
      handleFormValidate(formValues);

      onChange(formValues);
    },
    [handleFormValidate, formElement, onChange]
  );

  // TODO: Document
  const handleFormSubmit = useCallback(
    evt => {
      evt.preventDefault();

      const formValues = getFormValues(formElement);
      const isValid = handleFormValidate(formValues);

      if (isValid) {
        onSubmit(formValues);
      }
    },
    [handleFormValidate, formElement, onSubmit]
  );

  return {
    isValid,
    handleFormValidate,
    handleFormChange,
    handleFormSubmit,
    errors,
    setFormRef,
  };
}
