import useFormController from "./hooks/useFormController";

// TODO: Document and add prop-types
export default function Form({
  children,
  autoComplete = "off",
  validator = formValues => null,
  onChange = formValues => null,
  onSubmit = formValues => null,
  ...rest
}) {
  const { setFormRef, handleFormChange, handleFormSubmit, errors, isValid } =
    useFormController({
      onSubmit,
      onChange,
      validator,
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
