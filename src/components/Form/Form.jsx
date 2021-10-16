import useFormController from "./hooks/useFormController";

// TODO: Document
export default function Form({
  children,
  onSubmit,
  onChange = () => null,
  autoComplete = "off",
  ...rest
}) {
  const { setFormRef, handleFormChange, handleFormSubmit, errors, isValid } =
    useFormController({
      onSubmit,
      onChange,
      validator: formValues => {
        return {
          key:
            formValues.key.length < 1 &&
            "Key must contain at least one character",
        };
      },
    });

  return (
    <form
      {...rest}
      ref={setFormRef}
      autoComplete={autoComplete}
      onChange={handleFormChange}
      onSubmit={handleFormSubmit}
    >
      {children({ errors, isValid })}
    </form>
  );
}
