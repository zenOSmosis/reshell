import fs from 'fs';
import fetchIsDir from './isDir';
import rmdir from './rmdir';
import unlink from './unlink';

const rm = async (path) => {
  try {
    if (!fs.existsSync(path)) {
      return;
    }

    const isDir = await fetchIsDir(path);

    if (isDir) {
      return await rmdir(path);
    } else {
      return await unlink(path);
    }
  } catch (exc) {
    throw exc;
  }
};

export default rm;