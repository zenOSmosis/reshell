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
  const {
    setFormRef,
    handleFormChange,
    handleFormSubmit,
    handleFormValidate,
    errors,
    isValid,
  } = useFormController({
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
      {
        // TODO: Modify so that non-functional children presents an error showing how to use.  Look for other examples for how other libraries do this and adapt accordingly.
        children({
          errors,
          isValid,
          submit: handleFormSubmit,
          validate: handleFormValidate,
        })
      }
    </form>
  );
}
