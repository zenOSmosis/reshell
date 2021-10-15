import Center from "@components/Center";

import useFormController from "@hooks/useFormController";

export default function NewKeyCreationForm({
  initialKey,
  initialValue,
  initialStorageEngine,
  storageEngines,
  onSubmit,
}) {
  const { setFormRef, handleFormChange, handleFormSubmit, errors, isValid } =
    useFormController(onSubmit, formValues => {
      return {
        key:
          formValues.key.length < 1 &&
          "Key must contain at least one character",
      };
    });

  console.log({ errors });

  return (
    <Center canOverflow={true}>
      <form
        ref={setFormRef}
        autoComplete="off"
        onChange={handleFormChange}
        onSubmit={handleFormSubmit}
      >
        <input
          name="key"
          type="text"
          placeholder="Key"
          defaultValue={initialKey}
        />

        {errors?.key && (
          <div className="note" style={{ color: "red" }}>
            {errors.key}
          </div>
        )}

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
          <input type="submit" value="Submit" disabled={!isValid} />
        </div>
      </form>
    </Center>
  );
}
