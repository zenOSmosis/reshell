import './shared/socketFS.typedefs';
import fs from 'fs';

/**
 * @see https://nodejs.org/api/fs.html#fs_fs_mkdir_path_options_callback
 *
 * @param {string} path
 * @param {Object} options?
 * @return {Promise<void>}
 * @throws {Promise<Error>}
 */
const mkdir = (path, options = {}) => {
  return new Promise((resolve, reject) => {
    fs.mkdir(path, options, (error) => {
      if (error) {
        return reject(error);
      } else {
        return resolve();
      }
    });
  });
};

export default mkdir;