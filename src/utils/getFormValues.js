/**
 * @param {HTMLFormElement} formElement
 * @return {Object}
 */
export default function getFormValues(formElement) {
  const elements = formElement.elements;

  const values = {};

  for (const el of [...elements]) {
    const key = el.name || el.id;

    if (key) {
      values[key] = el.value;
    }
  }

  return values;
}
