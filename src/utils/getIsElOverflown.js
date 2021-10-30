/**
 * @param {DOMElement}
 * @return {boolean} Whether or not the element is overflowing its parent.
 */
export default function getIsElOverflown(element) {
  if (element) {
    // Height / width of the inner element, including padding and borders
    // @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetHeight
    const innerOffsetHeight = element.offsetHeight;
    const innerOffsetWidth = element.offsetWidth;

    const parentNode = element.parentNode;

    // Height / width of the outer element, including padding but excluding
    // borders, margins, and scrollbars
    // @see https://developer.mozilla.org/en-US/docs/Web/API/Element/clientHeight
    const outerHeight = parentNode?.clientHeight;
    const outerWidth = parentNode?.clientWidth;

    if (outerHeight < innerOffsetHeight || outerWidth < innerOffsetWidth) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}
