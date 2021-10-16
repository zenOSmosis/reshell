import axios from "axios";

// TODO: Document
export default async function fetchIsLatestVersion() {
  // TODO: Parse out local HTML, analyzing static JS links
  const ours = await fetchAssetManifest(false);

  const theirs = await fetchAssetManifest(true);

  return JSON.stringify(ours) === JSON.stringify(theirs);
}

// TODO: Document
async function fetchAssetManifest(isTheirs = true) {
  // TODO: Include optional homepage parameter if we're not basing off of root
  const response = await axios.get(
    // NOTE: Non-CRA (create-react-app) usage may need this to be modified accordingly
    `/asset-manifest.json${isTheirs ? `?__t=${new Date().getTime()}` : ""}`
  );

  return response.data;
}
