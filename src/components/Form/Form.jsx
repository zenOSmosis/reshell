import useFormController from "./hooks/useFormController";

// TODO: Document and add prop-types
export default function Form({
  children,
  onSubmit,
  onChange = () => null,
  autoComplete = "off",
  validator = formValues => null,
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
