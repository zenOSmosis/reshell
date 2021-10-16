import useFormController from "./hooks/useFormController";

// TODO: Document
export default function Form({
  children,
  onSubmit,
  autoComplete = "off",
  ...rest
}) {
  const { setFormRef, handleFormChange, handleFormSubmit, errors, isValid } =
    useFormController(onSubmit, formValues => {
      return {
        key:
          formValues.key.length < 1 &&
          "Key must contain at least one character",
      };
    });

  return (
    <form
      ref={setFormRef}
      autoComplete={autoComplete}
      onChange={handleFormChange}
      onSubmit={handleFormSubmit}
    >
      {children({ errors, isValid })}
    </form>
  );
}
