import axios from "axios";

/**
 * This attempts to determine if we're running the latest version, regardless
 * if we have the ability to control the server-side headers related to browser
 * caching.
 *
 * @return {Promise<boolean>}
 */
export default async function fetchIsLatestVersion() {
  const ours = await fetchIndexPage(false);
  const theirs = await fetchIndexPage(true);

  // FIXME: (jh) If caching is disabled, this may always return true
  return ours === theirs;
}

/**
 * @param {boolean} isTheirs? [default = true] Whether or not is forcefully
 * pulling a new copy from the server (vs. potentially from the local cache)
 * @return {string}
 */
async function fetchIndexPage(isTheirs = true) {
  // There may be a better way of doing this, but it also needs to work with
  // GitHub Pages or any Jamstack-related hosting
  const response = await axios.get(
    // NOTE: Non-CRA (create-react-app) usage may need this to be modified
    // accordingly
    //
    // This works because each build contains unique identifiers for CRA-
    // generated static assets.
    //
    // A previous attempt tried to look at asset-manifest.json, but that does
    // not seem to be very reliable if a service worker is not used
    `${process.env.PUBLIC_URL || ""}/index.html${
      isTheirs ? `?__t=${new Date().getTime()}` : ""
    }`
  );

  return response.data;
}
