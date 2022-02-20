/**
 * Retrieves the given element's upper-left-hand corner position in pixels
 * relative to its parent.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetLeft}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetTop}
 *
 * @param {HTMLElement} el
 * @return {{x: number, y: number}}
 */
export default function getElPosition(el) {
  return {
    x: el.offsetLeft,
    y: el.offsetTop,
  };
}
