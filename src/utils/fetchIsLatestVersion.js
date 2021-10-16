import axios from "axios";

/**
 * This attempts to determine if we're running the latest version, regardless
 * if we have the ability to control the server-side headers related to browser
 * caching.
 *
 * @return {Promise<boolean>}
 */
export default async function fetchIsLatestVersion() {
  const ours = _getStaticTags();

  const result = await axios.get(
    `${process.env.PUBLIC_URL || ""}?__t=${new Date().getTime()}`
  );
  const domParser = new window.DOMParser();
  const resultDOM = domParser.parseFromString(result.data, "text/html");

  const theirs = _getStaticTags(resultDOM);

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
