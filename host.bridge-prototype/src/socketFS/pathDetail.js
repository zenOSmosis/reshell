import pathLib from "path";
import stat from "./stat";
import fetchPathSeparator from "./fetchPathSeparator";
import readdir from "./readdir";
import mime from "mime-types";

const pathDetail = async path => {
  try {
    const pathSeparator = await fetchPathSeparator();

    // Normalize path
    path = path.toString().trim();
    // Remove trailing slash
    if (path.length > 1 && path[path.length - 1] === pathSeparator) {
      path.slice(0, -1);
    }
    // Replace double-occurrences of path separator w/ single
    path = path.replace(
      new RegExp(pathSeparator + pathSeparator),
      pathSeparator
    );

    const stats = await stat(path);
    /**
     * @type {PathParse}
     */
    const parsedPath = pathLib.parse(path);

    const constituents =
      path === pathSeparator
        ? [""] // Root directory
        : path.split(pathSeparator).splice(1);

    let isFile = false;
    let isDir = false;
    if (stats) {
      isFile = stats.isFile();
      isDir = stats.isDirectory();
    }

    // A user-friendly, string representation of the path type
    let kind = isFile ? "File" : isDir ? "Directory" : "?";

    let children = undefined;
    if (isDir) {
      children = await readdir(path);
    }

    // Unix only
    const isHidden = parsedPath.base.startsWith(".");
    const parent = parsedPath.dir !== path ? parsedPath.dir : null;

    const mimeType = mime.lookup(path);

    return {
      children,
      constituents,
      mimeType,
      parent,
      path,
      ...parsedPath,
      isFile,
      isDir,
      kind,
      isHidden,
      stats,
    };
  } catch (exc) {
    throw exc;
  }
};

export default pathDetail;
