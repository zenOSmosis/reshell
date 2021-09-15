import fs from 'fs';

/**
 * Reads the contents of a directory.
 * 
 * @see https://nodejs.org/api/fs.html#fs_fs_readdir_path_options_callback
 * 
 * @param {string} path
 * @param {Object} options?
 * @return {Promise<string[]>}
 */
const readdir = (path, options = {}) => {
  return new Promise((resolve, reject) => {
    fs.readdir(path, options, (error, files) => {
      if (error) {
        return reject(error);
      } else {
        return resolve(files);
      }
    });
  });
};

export default readdir;