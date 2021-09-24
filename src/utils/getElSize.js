/**
 * TODO: Document
 *
 * @param {DOMElement} el
 * @return {Object} // TODO: Document more thoroughly
 */
export default function getElSize(el) {
  const width = el.offsetWidth;
  const height = el.offsetHeight;

  return {
    width,
    height,
  };
}
