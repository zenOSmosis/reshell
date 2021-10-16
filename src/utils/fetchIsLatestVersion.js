import axios from "axios";

/**
 * This attempts to determine if we're running the latest version, regardless
 * if we have the ability to control the server-side headers related to browser
 * caching.
 *
 * @return {Promise<boolean>}
 */
export default async function fetchIsLatestVersion() {
  const ours = await fetchAssetManifest(false);
  const theirs = await fetchAssetManifest(true);

  return ours === theirs;
}

/**
 * @param {boolean} isTheirs? [default = true] Whether or not is forcefully
 * pulling a new copy from the server (vs. potentially from the local cache)
 * @return {string}
 */
async function fetchAssetManifest(isTheirs = true) {
  // There may be a better way of doing this, but it also needs to work with
  // GitHub Pages or any Jamstack-related hosting
  const response = await axios.get(
    // NOTE: Non-CRA (create-react-app) usage may need this to be modified
    // accordingly
    `${process.env.PUBLIC_URL || ""}/asset-manifest.json${
      isTheirs ? `?__t=${new Date().getTime()}` : ""
    }`
  );

  return JSON.stringify(response.data);
}
