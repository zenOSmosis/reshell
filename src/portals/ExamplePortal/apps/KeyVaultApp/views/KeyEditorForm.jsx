import Center from "@components/Center";
import Padding from "@components/Padding";
import Form from "@components/Form";

export default function KeyEditorForm({
  initialKey,
  initialValue,
  initialStorageEngine,
  storageEngines,
  onSubmit,
}) {
  return (
    <Center canOverflow={true}>
      <Form
        onSubmit={onSubmit}
        validator={formValues => {
          return {
            // TODO: Refactor into KeyEditorForm
            key:
              formValues.key.length < 1 &&
              "Key must contain at least one character",
          };
        }}
      >
        {({ errors, isValid }) => (
          <>
            <Padding>
              <input
                name="key"
                type="text"
                placeholder="Key"
                defaultValue={initialKey}
                required
              />
            </Padding>

            {errors?.key && (
              <div className="note" style={{ color: "red" }}>
                {errors.key}
              </div>
            )}

            <Padding>
              <textarea
                name="value"
                placeholder="Value"
                defaultValue={initialValue}
              ></textarea>
            </Padding>

            <Padding style={{ marginTop: 20, textAlign: "left" }}>
              <label>Storage Engine</label>
              <select
                name="storageEngineShortUUID"
                defaultValue={initialStorageEngine?.getShortUUID()}
                required
              >
                {storageEngines.map(storageEngine => {
                  const title = storageEngine.getTitle();
                  const shortUUID = storageEngine.getShortUUID();

                  return (
                    <option key={title} value={shortUUID}>
                      {title}
                    </option>
                  );
                })}
              </select>
            </Padding>

            <div>
              <input type="submit" value="Submit" disabled={!isValid} />
            </div>
          </>
        )}
      </Form>
    </Center>
  );
}
