import pathDetail from "./pathDetail";
import checkIsDir from "./isDir";
import fetchPathSeparator from "./fetchPathSeparator";

// TODO: Document
const dirDetail = async path => {
  try {
    const isDir = await checkIsDir(path);
    if (!isDir) {
      throw new Error("Path is not a directory");
    }

    const detail = await pathDetail(path);

    // Use normalized path
    path = detail.path;

    const pathSeparator = await fetchPathSeparator();

    // TODO: Choose whether or not to show recursive
    let { children } = detail;
    for (let i = 0; i < children.length; i++) {
      try {
        children[i] = await pathDetail(`${path}${pathSeparator}${children[i]}`);
      } catch (exc) {
        // TODO: Document why not exposing error
        console.error(exc);

        children[i] = {
          error: exc,
        };
      }
    }

    detail.children = children;

    return detail;
  } catch (exc) {
    throw exc;
  }
};

export default dirDetail;
