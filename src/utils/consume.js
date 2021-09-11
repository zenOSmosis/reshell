/**
 * Consumes a variable without using it.
 *
 * @param {any} obj
 * @return {null}
 */
export default function consume(obj) {
  return Boolean(obj) ? null : null;
}
