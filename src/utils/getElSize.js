/**
 * Retrieves the given element's size in pixels.
 *
 * @param {DOMElement} el
 * @return {{width: number, height: number}}
 */
export default function getElSize(el) {
  const width = el.offsetWidth;
  const height = el.offsetHeight;

  return {
    width,
    height,
  };
}
