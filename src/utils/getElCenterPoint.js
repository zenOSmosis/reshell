/**
 * TODO: Document
 *
 * @see https://stackoverflow.com/a/46921780
 *
 * @param {DOMElement} el
 * @return {Object} // TODO: Document more thoroughly
 */
export default function getElCenterPoint(el) {
  const x = el.offsetLeft + el.offsetWidth / 2;
  const y = el.offsetTop + el.offsetHeight / 2;

  return {
    x,
    y,
  };
}
