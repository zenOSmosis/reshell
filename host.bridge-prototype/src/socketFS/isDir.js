import stat from './stat';

/**
 * Determines if the path is a directory.
 * 
 * @see https://nodejs.org/api/fs.html#fs_stats_isdirectory
 * 
 * @param {string} path
 * @return {Promise<boolean>} 
 */
const isDir = async (path) => {
  try {
    const stats = await stat(path);

    return stats.isDirectory();
  } catch (exc) {
    throw exc;
  }
};

export default isDir;