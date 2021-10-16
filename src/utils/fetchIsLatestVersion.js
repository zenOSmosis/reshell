import axios from "axios";

/**
 * This attempts to determine if we're running the latest version, regardless
 * if we have the ability to control the server-side headers related to browser
 * caching.
 *
 * @return {Promise<boolean>}
 */
export default async function fetchIsLatestVersion() {
  /**
   * @type {string[]} Array of static tag sources from our own DOM.
   */
  const ours = _getStaticTags();

  // Pull the remote index.html file with a cache-busting timestamp appended
  const response = await axios.get(
    `${process.env.PUBLIC_URL || ""}/?__t=${new Date().getTime()}`
  );

  // Parse the remote response with browser's included DOMParser
  const domParser = new window.DOMParser();
  const resultDOM = domParser.parseFromString(response.data, "text/html");

  /**
   * @type {string[]} Array of static tag sources from the remote DOM.
   */
  const theirs = _getStaticTags(resultDOM);

  if (theirs.length === 0) {
    throw new Error("Unable to acquire remote info");
  }

  for (const src of theirs) {
    if (!ours.includes(src)) {
      return false;
    }
  }

  return true;
}

/**
 * @param {Object} dom? [default = window.document]
 * @return {string[]}
 */
function _getStaticTags(dom = window.document) {
  const jsTags = [...dom.getElementsByTagName("script")];

  const staticJsTagSrcs = jsTags
    .filter(tag => tag.getAttribute("src")?.startsWith("/static"))
    .map(tag => tag.getAttribute("src"));

  return staticJsTagSrcs;
}
