import axios from "axios";

// TODO: Document
//
// IMPORTANT: This is set up to only work with create-react-app and may need
// to be modified otherwise
export default async function fetchIsLatestVersion() {
  // CRA seems to alter the directory structure, per request, so we have to
  // skip it in development
  if (process.env.NODE_ENV === "development") {
    return true;
  }

  // TODO: Parse out local HTML, analyzing static JS links
  const ours = _getStaticTags();

  const result = await axios.get(`/?__t=${new Date().getTime()}`);
  const resultDOM = new window.DOMParser(result.data);

  const theirs = _getStaticTags(resultDOM.document);

  for (const src of theirs) {
    console.log({ src, ours });

    if (!ours.includes(src)) {
      return false;
    }
  }

  return true;
}

// TODO: Document
function _getStaticTags(document = window.document) {
  const jsTags = [...document.getElementsByTagName("script")];
  const staticJsTagSrcs = jsTags
    .filter(tag => tag.getAttribute("src")?.startsWith("/static"))
    .map(tag => tag.getAttribute("src"));

  return staticJsTagSrcs;
}
