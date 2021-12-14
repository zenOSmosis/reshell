/**
 * Shallow-copies an object which contains data to be represented in a web
 * form, coercing the returned values to string type.
 *
 * @param {Object} data
 * @return {Object}
 */
export default function toFormValues(data) {
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      value === undefined || value === null ? "" : value.toString(),
    ])
  );
}
