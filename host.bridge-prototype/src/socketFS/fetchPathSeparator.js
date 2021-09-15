import path from "path";

// TODO: Rename to getPathSeparator
/**
 * @return {string} Either "/" (on Unix-like) or "\" (on Windows)
 */
const fetchPathSeparator = () => {
  const { sep } = path;

  return sep;
};

export default fetchPathSeparator;
