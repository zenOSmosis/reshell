import packageJson from "../../package.json";

const { version } = packageJson;

/**
 * @return {string}
 */
export default function getReShellVersion() {
  return version;
}
