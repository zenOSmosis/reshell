import stat from './stat';

/**
 * Determines if the path is a file.
 * 
 * @see https://nodejs.org/api/fs.html#fs_stats_isfile
 * 
 * @param {string} path
 * @return {Promise<boolean>} 
 */
const isFile = async (path) => {
  try {
    const stats = await stat(path);

    return stats.isFile();
  } catch (exc) {
    throw exc;
  }
};

export default isFile;